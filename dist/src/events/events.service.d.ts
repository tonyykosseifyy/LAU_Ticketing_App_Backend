/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { IEvent } from './interface/event.interface';
import { Model } from 'mongoose';
import { IUser } from '../users/interface/user.interface';
import { CreateEventDto, UpdateEventEndDto, UpdateEventDto, CreateEventDtoAdmin } from './dto/index.dto';
import { MailService } from '../mail/mail.service';
import { IScan, IScanDetailed } from '../scans/interface/scan.interface';
import { Types } from 'mongoose';
export declare class EventsService {
    private readonly eventModel;
    private readonly userModel;
    private readonly scanModel;
    private readonly mailService;
    private cronJobs;
    constructor(eventModel: Model<IEvent>, userModel: Model<IUser>, scanModel: Model<IScan>, mailService: MailService);
    getAllEvents(): Promise<IEvent[]>;
    getUserEvents(userId: string): Promise<IEvent[]>;
    getActiveUserEvents(userId: string): Promise<any[]>;
    deleteMultipleEvents(eventsIds: string[]): Promise<void>;
    deleteEventAdmin(eventId: string): Promise<IEvent>;
    stopCronJob(eventId: string): void;
    deleteEvent(eventId: string, user: IUser): Promise<IEvent>;
    updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<import("mongoose").Document<unknown, {}, IEvent> & IEvent & {
        _id: Types.ObjectId;
    }>;
    updateEventEndDate(eventId: string, user: IUser, updateEventDto: UpdateEventEndDto): Promise<IEvent>;
    createEvent(event: CreateEventDto): Promise<IEvent>;
    createAdminEvent(event: CreateEventDtoAdmin): Promise<IEvent>;
    scheduleEventEndTask(endDate: Date, eventId: string): void;
    private handleEventEnd;
    sendEventExcelByEmail(event: IEvent, scans: IScanDetailed[]): Promise<void>;
    getEventById(eventId: string): Promise<any>;
    getEventsDashboard(): Promise<IEvent[]>;
}
