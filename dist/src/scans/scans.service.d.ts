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
import { Model } from 'mongoose';
import { ScanEventDto } from './dto/scan-event.dto';
import { IEvent } from '../events/interface/event.interface';
import { IStudent } from 'src/students/interface/student.interface';
import { IScan } from './interface/scan.interface';
import { AuthenticatedRequest } from 'src/interface/request.interface';
export declare class ScansService {
    private readonly scanModel;
    private readonly eventModel;
    private readonly studentModel;
    constructor(scanModel: Model<IScan>, eventModel: Model<IEvent>, studentModel: Model<IStudent>);
    scanEvent(scanEventDto: ScanEventDto, eventId: string, request: AuthenticatedRequest): Promise<void>;
    getStudentEvents(student_object_id: number): Promise<any[]>;
    getEventAttendeesAdmin(eventId: string): Promise<any[]>;
    getEventAttendees(eventId: string, request: AuthenticatedRequest): Promise<any[]>;
    deleteStudentScans(studentId: number): Promise<void>;
}
