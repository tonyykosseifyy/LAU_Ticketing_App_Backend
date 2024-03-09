import { Injectable } from '@nestjs/common';
import { IEvent } from '../events/interface/event.interface';
import { EventsService } from '../events/events.service';

@Injectable()
export class AdminsService {
    constructor(
        private readonly eventsService: EventsService) {}
        

    // GET all events
    async getAllEvents(): Promise<IEvent[]> {
        return await this.eventsService.getAllEvents();
    }

    async getEventById(eventId: string): Promise<IEvent> {
        return await this.eventsService.getEventById(eventId);
    }

    

    
}
