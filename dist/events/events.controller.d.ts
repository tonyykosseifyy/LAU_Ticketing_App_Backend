import { EventsService } from './events.service';
import { AuthenticatedRequest } from '../interface/request.interface';
import { CreateEventDto, UpdateEventEndDto } from './dto/index.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    getUserEvents(request: AuthenticatedRequest, response: any): Promise<any>;
    getActiveUserEvents(request: AuthenticatedRequest): Promise<any>;
    createEvent(request: AuthenticatedRequest, createEventDto: CreateEventDto, response: any): Promise<any>;
    deleteEvent(eventId: string, response: any, request: AuthenticatedRequest): Promise<any>;
    updateEvent(eventId: string, response: any, request: AuthenticatedRequest, updateEventDto: UpdateEventEndDto): Promise<any>;
}
