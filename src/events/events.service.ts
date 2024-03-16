import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IEvent, IEventWithCount } from './interface/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../users/interface/user.interface';
import { CreateEventDto, UpdateEventEndDto, UpdateEventDto, CreateEventDtoAdmin } from './dto/index.dto';
import { CronJob } from 'cron';
import { MailService } from '../mail/mail.service';
import { createEventExcelFile } from './utils/excel';
import { IScan, IScanDetailed } from '../scans/interface/scan.interface';
import { Types } from 'mongoose';
import Bottleneck from 'bottleneck'


@Injectable()
export class EventsService {
    private cronJobs: Map<string, CronJob> = new Map();
    constructor(
        @InjectModel('Event') private readonly eventModel: Model<IEvent>,
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('Scan') private readonly scanModel: Model<IScan>,
        private readonly mailService: MailService
    ) {}

    async getAllEvents(): Promise<IEvent[]> {
        const events = await this.eventModel.find().sort({ start_date: -1 });
        return events;
    }
    
    async getUserEvents(userId: string): Promise<IEvent[]> {
        const user = await this.userModel.findById(userId).populate({
            path: 'events',
            model: 'Event'
        });
        
        if (!user) {
            throw new NotFoundException(`Club with ID ${userId} not found`);
        }

        return user.events as unknown[] as IEvent[];
    }

    async getActiveUserEvents(userId: string): Promise<any[]> {
        const userObjectId = new Types.ObjectId(userId);
    
        const events = await this.eventModel.find({
            users: userObjectId,
            end_date: { $gte: new Date() }
        });
        // for each event get the number of attendees
        const eventsWithCount = await Promise.all(events.map(async event => {
            const count = await this.scanModel.countDocuments({ event: event._id.toString() });
            const eventData = event.toObject();
            return {
                ...eventData,
                attendee_count: count
            };
        }));

        return eventsWithCount;
    }
    
    
      
    async deleteMultipleEvents(eventsIds: string[]): Promise<void> {
        const limiter = new Bottleneck({
            maxConcurrent: 7, // Maximum number of concurrent jobs
        });

        const deletePromises = eventsIds.map(eventId =>
            limiter.schedule(() => this.deleteEventAdmin(eventId))
        );
        
        await Promise.all(deletePromises);
    }
      

      
    async deleteEventAdmin(eventId: string): Promise<IEvent> {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        // Remove the event from the user
        await this.userModel.updateMany({ events: eventId }, { $pull: { events: event._id } });
        // Remove the event from the database
        await this.eventModel.findByIdAndDelete(eventId);

        // Stop and remove the cron job associated with this event
        this.stopCronJob(eventId);

        return event;
    }
    stopCronJob(eventId: string) {
        const cronJob = this.cronJobs.get(eventId);
        if (cronJob) {
            cronJob.stop();
            this.cronJobs.delete(eventId);
        }
    }


    async deleteEvent(eventId: string, user: IUser): Promise<IEvent> {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        if (!event.users.includes(user._id)) {
            throw new BadRequestException(`Event with ID ${eventId} does not belong to user with ID ${user._id}`);
        }
        // Remove the event from the user
        await this.userModel.findByIdAndUpdate(user._id, { $pull: { events: event._id } });
        // Remove the event from the database
        await this.eventModel.findByIdAndDelete(eventId);



        // Stop and remove the cron job associated with this event
        this.stopCronJob(eventId);
        return event; 
    }

    async updateEvent(eventId: string, updateEventDto: UpdateEventDto) {
        const event = await this.eventModel.findByIdAndUpdate(eventId, updateEventDto, { new: true });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        return event;
    }
    
    async updateEventEndDate(eventId: string, user: IUser, updateEventDto: UpdateEventEndDto): Promise<IEvent> {
        const { end_date } = updateEventDto;

        const event: IEvent = await this.eventModel.findById(eventId);
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        if (!event.users.includes(user._id)) {
            throw new BadRequestException(`Event with ID ${eventId} does not belong to user with ID ${user._id}`);
        }

        // check that event end date is greater than event start date
        const startDate = new Date(event.start_date);
        const endDate = new Date(end_date);

        if (endDate < startDate) {
            throw new BadRequestException(`Event end date must be greater than event start date`);
        }
        // update the event
        event.end_date = end_date;
        try {
            await event.save();
        } catch(err) {
            throw new BadRequestException(`Error updating event: ${err}`);
        }
        return event;
    }

    async createEvent(event: CreateEventDto): Promise<IEvent> {
        // check if the event name is already taken
        const oldEvent = await this.eventModel.findOne({ name: { $regex: event.name , $options: 'i' } });
        if (oldEvent) {
            throw new BadRequestException(`${event.name} Event already exists`);
        }
        // user_ids is an array of user IDs
        const user_ids = event.users ;
        
        // Reflect function to handle each promise
        const reflect = async (userId: string, index: number) => {
            try {
                const user = await this.userModel.findById(userId);
                if (!user) {
                    throw new NotFoundException(`User with ID ${userId} not found`);
                }
                return { user, index, status: "resolved" };
            } catch (error) {
                return { error, index, status: "rejected" };
            }
        };

        // Check all users
        let usersStatus;

        try {
            usersStatus = await Promise.all(user_ids.map((userId, index) => reflect(userId, index)));
        } catch (error) {
            throw new NotFoundException(`Error checking users: ${error}`);
        }

        const notFoundUsers = usersStatus
            .filter(result => result.status === "rejected")
            .map(result => user_ids[result.index]);

        if (notFoundUsers.length > 0) {
            throw new NotFoundException(`Clubs not found: ${notFoundUsers.join(', ')}`);
        }

        // Create the event
        const newEvent = new this.eventModel(event);
        
        try {
            await newEvent.save();
            await Promise.all(user_ids.map(userId => 
                this.userModel.findByIdAndUpdate(userId, { $push: { events: newEvent._id } })
            ));
        } catch (error) {
            throw new NotFoundException(`Error creating event: ${error}`);
        }
        
        // cron job 
        this.scheduleEventEndTask(new Date(newEvent.end_date), newEvent._id);

        return newEvent;
    }  
    async createAdminEvent(event: CreateEventDtoAdmin): Promise<IEvent> {
        const oldEvent = await this.eventModel.findOne({ name: { $regex: event.name , $options: 'i' } });
        if (oldEvent) {
            throw new BadRequestException(`${event.name} Event already exists`);
        }
        // check if the user it not an admin
        const user = await this.userModel.findById(event.user);
        if (!user) {
            throw new BadRequestException(`User with ID ${event.user} not found`); 
        }
        if (user.role == 'admin') {
            throw new BadRequestException(`User with ID ${event.user} is not a club admin`); 
        }
        // Create the event
        const newEvent = new this.eventModel({
            ...event,
            users: [event.user]
        });
        await newEvent.save();
        await this.userModel.findByIdAndUpdate(event.user, { $push: { events: newEvent._id } });

        // cron job 
        this.scheduleEventEndTask(new Date(newEvent.end_date), newEvent._id);

        return newEvent;
    }
    
    scheduleEventEndTask(endDate: Date, eventId: string) {
        const job = new CronJob(endDate, () => {
            this.handleEventEnd(eventId);
        });
        job.start();
        this.cronJobs.set(eventId, job);
    }

    
    private async handleEventEnd(eventId: string) {
        // get event
        const event: IEvent = await this.eventModel.findById(eventId);
        
        if ( !event ) {
            return;
        }
        // get scans for this event
        const eventIdString = eventId.toString();
        const scans: IScanDetailed[] = await this.scanModel.find({ event: eventIdString }).populate({
            path: 'student',
            model: 'Student',
            select: 'name student_id _id'
        });
        
        await this.sendEventExcelByEmail(event, scans);
    }

    
    async sendEventExcelByEmail(event: IEvent, scans: IScanDetailed[]) {
        const excelBuffer = await createEventExcelFile(scans);
        const attachment = {
            filename: `EventData-${event.name}.xlsx`,
            content: excelBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        const eventData = event.toObject();
        const data: IEventWithCount = {
            ...eventData,
            attendee_count: scans.length
        };

        await this.mailService.sendEventData(data, attachment);
    }
    

    async getEventById(eventId: string): Promise<IEvent> {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        return event;
    }

    async getEventsDashboard(): Promise<IEvent[]> {
        const events = await this.eventModel.find().populate({
            path: 'attendees',
            model: 'Student'
        });

        return events;
    }
}

