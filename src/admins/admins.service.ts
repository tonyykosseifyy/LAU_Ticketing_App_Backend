import { Injectable } from '@nestjs/common';
import { IEvent } from '../events/interface/event.interface';
import { EventsService } from '../events/events.service';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminsService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
    ) {}
        

    // GET all events
    async getAllEvents(): Promise<IEvent[]> {
        return await this.eventsService.getAllEvents();
    }

    async getEventById(eventId: string): Promise<IEvent> {
        return await this.eventsService.getEventById(eventId);
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.usersService.getAllUsers();
    }

    async getDetailedUsers(): Promise<IUser[]> {
        return await this.usersService.getDetailedUsers();
    }
    

    
}
