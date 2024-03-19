"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cron_1 = require("cron");
const mail_service_1 = require("../mail/mail.service");
const excel_1 = require("./utils/excel");
const mongoose_3 = require("mongoose");
const bottleneck_1 = require("bottleneck");
let EventsService = class EventsService {
    constructor(eventModel, userModel, scanModel, mailService) {
        this.eventModel = eventModel;
        this.userModel = userModel;
        this.scanModel = scanModel;
        this.mailService = mailService;
        this.cronJobs = new Map();
    }
    async getAllEvents() {
        const events = await this.eventModel.find().sort({ start_date: -1 });
        return events;
    }
    async getUserEvents(userId) {
        const user = await this.userModel.findById(userId).populate({
            path: 'events',
            model: 'Event'
        });
        if (!user) {
            throw new common_1.NotFoundException(`Club with ID ${userId} not found`);
        }
        return user.events;
    }
    async getActiveUserEvents(userId) {
        const userObjectId = new mongoose_3.Types.ObjectId(userId);
        const events = await this.eventModel.find({
            users: userObjectId,
            end_date: { $gte: new Date() }
        });
        const eventsWithCount = await Promise.all(events.map(async (event) => {
            const count = await this.scanModel.countDocuments({ event: event._id.toString() });
            const eventData = event.toObject();
            return {
                ...eventData,
                attendee_count: count
            };
        }));
        return eventsWithCount;
    }
    async deleteMultipleEvents(eventsIds) {
        const limiter = new bottleneck_1.default({
            maxConcurrent: 7,
        });
        const deletePromises = eventsIds.map(eventId => limiter.schedule(() => this.deleteEventAdmin(eventId)));
        await Promise.all(deletePromises);
    }
    async deleteEventAdmin(eventId) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        await this.userModel.updateMany({ events: eventId }, { $pull: { events: event._id } });
        await this.eventModel.findByIdAndDelete(eventId);
        this.stopCronJob(eventId);
        return event;
    }
    stopCronJob(eventId) {
        const cronJob = this.cronJobs.get(eventId);
        if (cronJob) {
            cronJob.stop();
            this.cronJobs.delete(eventId);
        }
    }
    async deleteEvent(eventId, user) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        if (!event.users.includes(user._id)) {
            throw new common_1.BadRequestException(`Event with ID ${eventId} does not belong to user with ID ${user._id}`);
        }
        await this.userModel.findByIdAndUpdate(user._id, { $pull: { events: event._id } });
        await this.eventModel.findByIdAndDelete(eventId);
        this.stopCronJob(eventId);
        return event;
    }
    async updateEvent(eventId, updateEventDto) {
        const event = await this.eventModel.findByIdAndUpdate(eventId, updateEventDto, { new: true });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        return event;
    }
    async updateEventEndDate(eventId, user, updateEventDto) {
        const { end_date } = updateEventDto;
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        if (!event.users.includes(user._id)) {
            throw new common_1.BadRequestException(`Event with ID ${eventId} does not belong to user with ID ${user._id}`);
        }
        const startDate = new Date(event.start_date);
        const endDate = new Date(end_date);
        if (endDate < startDate) {
            throw new common_1.BadRequestException(`Event end date must be greater than event start date`);
        }
        event.end_date = end_date;
        try {
            await event.save();
        }
        catch (err) {
            throw new common_1.BadRequestException(`Error updating event: ${err}`);
        }
        return event;
    }
    async createEvent(event) {
        const oldEvent = await this.eventModel.findOne({ name: { $regex: event.name, $options: 'i' } });
        if (oldEvent) {
            throw new common_1.BadRequestException(`${event.name} Event already exists`);
        }
        const user_ids = event.users;
        const reflect = async (userId, index) => {
            try {
                const user = await this.userModel.findById(userId);
                if (!user) {
                    throw new common_1.NotFoundException(`User with ID ${userId} not found`);
                }
                return { user, index, status: "resolved" };
            }
            catch (error) {
                return { error, index, status: "rejected" };
            }
        };
        let usersStatus;
        try {
            usersStatus = await Promise.all(user_ids.map((userId, index) => reflect(userId, index)));
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error checking users: ${error}`);
        }
        const notFoundUsers = usersStatus
            .filter(result => result.status === "rejected")
            .map(result => user_ids[result.index]);
        if (notFoundUsers.length > 0) {
            throw new common_1.NotFoundException(`Clubs not found: ${notFoundUsers.join(', ')}`);
        }
        const newEvent = new this.eventModel(event);
        try {
            await newEvent.save();
            await Promise.all(user_ids.map(userId => this.userModel.findByIdAndUpdate(userId, { $push: { events: newEvent._id } })));
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error creating event: ${error}`);
        }
        this.scheduleEventEndTask(new Date(newEvent.end_date), newEvent._id);
        return newEvent;
    }
    async createAdminEvent(event) {
        const oldEvent = await this.eventModel.findOne({ name: { $regex: event.name, $options: 'i' } });
        if (oldEvent) {
            throw new common_1.BadRequestException(`${event.name} Event already exists`);
        }
        const user = await this.userModel.findById(event.user);
        if (!user) {
            throw new common_1.BadRequestException(`User with ID ${event.user} not found`);
        }
        if (user.role == 'admin') {
            throw new common_1.BadRequestException(`User with ID ${event.user} is not a club admin`);
        }
        const newEvent = new this.eventModel({
            ...event,
            users: [event.user]
        });
        await newEvent.save();
        await this.userModel.findByIdAndUpdate(event.user, { $push: { events: newEvent._id } });
        this.scheduleEventEndTask(new Date(newEvent.end_date), newEvent._id);
        return newEvent;
    }
    scheduleEventEndTask(endDate, eventId) {
        const job = new cron_1.CronJob(endDate, () => {
            this.handleEventEnd(eventId);
        });
        job.start();
        this.cronJobs.set(eventId, job);
    }
    async handleEventEnd(eventId) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            return;
        }
        const eventIdString = eventId.toString();
        const scans = await this.scanModel.find({ event: eventIdString }).populate({
            path: 'student',
            model: 'Student',
            select: 'name student_id _id'
        });
        await this.sendEventExcelByEmail(event, scans);
    }
    async sendEventExcelByEmail(event, scans) {
        const excelBuffer = await (0, excel_1.createEventExcelFile)(scans);
        const attachment = {
            filename: `EventData-${event.name}.xlsx`,
            content: excelBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        const eventData = event.toObject();
        const data = {
            ...eventData,
            attendee_count: scans.length
        };
        await this.mailService.sendEventData(data, attachment);
    }
    async getEventById(eventId) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        const scans = await this.scanModel.find({ event: eventId }).populate({
            path: 'student',
            model: 'Student',
            select: 'name student_id _id'
        });
        const eventData = event.toObject();
        const data = {
            ...eventData,
            scans: scans,
            attendee_count: scans.length
        };
        return data;
    }
    async getEventsDashboard() {
        const events = await this.eventModel.find().populate({
            path: 'attendees',
            model: 'Student'
        });
        return events;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Event')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __param(2, (0, mongoose_1.InjectModel)('Scan')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mail_service_1.MailService])
], EventsService);
//# sourceMappingURL=events.service.js.map