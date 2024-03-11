import { Injectable } from '@nestjs/common';
import { IEvent } from '../events/interface/event.interface';
import { EventsService } from '../events/events.service';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';

@Injectable()
export class AdminsService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
    ) {}
        

    // GET All Events
    async getAllEvents(): Promise<IEvent[]> {
        return await this.eventsService.getAllEvents();
    }
    // GET Event By Id
    async getEventById(eventId: string): Promise<IEvent> {
        return await this.eventsService.getEventById(eventId);
    }
    
    // Update Event
    async updateEvent(eventId: string, payload: UpdateEventDto): Promise<IEvent> {
        return await this.eventsService.updateEvent(eventId, payload);
    }

    // Delete Event 
    async deleteEvent(eventId: string): Promise<IEvent> {
        return await this.eventsService.deleteEventAdmin(eventId);
    }
    // -----------------------------------------
    
    // GET All Users
    async getAllUsers(): Promise<IUser[]> {
        return await this.usersService.getAllUsers();
    }

    // GET Detailed Users
    async getDetailedUsers(): Promise<IUser[]> {
        return await this.usersService.getDetailedUsers();
    }
    // GET User By Id
    async getUserById(userId: string): Promise<IUser | null> {
        return await this.usersService.findById(userId);
    }
}
