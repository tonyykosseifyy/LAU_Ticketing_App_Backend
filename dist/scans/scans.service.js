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
exports.ScansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ScansService = class ScansService {
    constructor(scanModel, eventModel, studentModel) {
        this.scanModel = scanModel;
        this.eventModel = eventModel;
        this.studentModel = studentModel;
    }
    async scanEvent(scanEventDto, eventId, request) {
        const user = request.user;
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        if (!event.users.includes(user._id)) {
            throw new common_1.NotFoundException(`User is not part of this event`);
        }
        const now = new Date();
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        if (now < startDate || now > endDate) {
            throw new common_1.NotFoundException(`${event.name} event is not active`);
        }
        const { student_id, name } = scanEventDto;
        let student = await this.studentModel.findOne({ student_id });
        if (!student && !name) {
            throw new common_1.NotFoundException(`Student with ID ${student_id} not found, Please provide a name`);
        }
        if (!student && name) {
            student = new this.studentModel({ student_id, name });
            await student.save();
        }
        const oldScan = await this.scanModel.findOne({ student: student._id, event: eventId });
        if (oldScan) {
            throw new common_1.BadRequestException(`Student already scanned this event`);
        }
        const scan = new this.scanModel({
            student: student._id,
            event: eventId,
            date: now
        });
        await scan.save();
    }
    async getStudentEvents(student_object_id) {
        const scans = await this.scanModel.find({ student: student_object_id }).populate({
            path: 'event',
            model: 'Event',
            select: '_id name start_date end_date'
        });
        return scans;
    }
    async getEventAttendeesAdmin(eventId) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        const scans = await this.scanModel.find({ event: eventId }).populate({
            path: 'student',
            model: 'Student',
            select: 'name student_id _id'
        });
        if (!scans) {
            throw new common_1.NotFoundException(`No scans found for this ${event.name}} event`);
        }
        return scans;
    }
    async getEventAttendees(eventId, request) {
        const user = request.user;
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        if (!event.users.includes(user._id)) {
            throw new common_1.NotFoundException(`Club is not part of this event`);
        }
        const scans = await this.scanModel.find({ event: eventId }).populate({
            path: 'student',
            model: 'Student',
            select: 'name student_id _id'
        });
        if (!scans) {
            throw new common_1.NotFoundException(`No scans found for this ${event.name}} event`);
        }
        return scans;
    }
    async deleteStudentScans(studentId) {
        const student = await this.studentModel.findOne({ student_id: studentId });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        await this.scanModel.deleteMany({ student: student._id });
    }
};
exports.ScansService = ScansService;
exports.ScansService = ScansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Scan')),
    __param(1, (0, mongoose_1.InjectModel)('Event')),
    __param(2, (0, mongoose_1.InjectModel)('Student')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ScansService);
//# sourceMappingURL=scans.service.js.map