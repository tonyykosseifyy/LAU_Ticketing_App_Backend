import { Injectable, NotFoundException } from '@nestjs/common';
import { IEvent } from './interface/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IClub } from 'src/clubs/interface/club.interface';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel('Event') private readonly eventModel: Model<IEvent>,
        @InjectModel('Club') private readonly clubModel: Model<IClub> 
    ) {}

    async getClubEvents(clubId: string): Promise<IEvent[]> {
        const club = await this.clubModel.findById(clubId).populate('events');

        if (!club) {
            throw new NotFoundException(`Club with ID ${clubId} not found`);
        }

        return club.events as unknown[] as IEvent[];
    }

    async createEvent(event: CreateEventDto): Promise<IEvent> {
        // check if the event name is already taken
        const oldEvent = await this.eventModel.findOne({ name: { $regex: event.name , $options: 'i' } });
        if (oldEvent) {
            const oldEventStartDate = new Date(oldEvent.start_date);
            const newEventStartDate = new Date(event.start_date);
            if (oldEventStartDate.getTime() === newEventStartDate.getTime()) {
                throw new NotFoundException(`Event ${event.name} already exists`);
            }
        }
        // club_ids is an array of club IDs
        const club_ids = event.clubs ;
        
        // Reflect function to handle each promise
        const reflect = async (clubId: string, index: number) => {
            try {
                const club = await this.clubModel.findById(clubId);
                if (!club) {
                    throw new NotFoundException(`Club with ID ${clubId} not found`);
                }
                return { club, index, status: "resolved" };
            } catch (error) {
                return { error, index, status: "rejected" };
            }
        };

        // Check all clubs
        let clubsStatus;

        try {
            clubsStatus = await Promise.all(club_ids.map((clubId, index) => reflect(clubId, index)));
        } catch (error) {
            throw new NotFoundException(`Error checking clubs: ${error}`);
        }

        const notFoundClubs = clubsStatus
            .filter(result => result.status === "rejected")
            .map(result => club_ids[result.index]);

        if (notFoundClubs.length > 0) {
            throw new NotFoundException(`Clubs not found: ${notFoundClubs.join(', ')}`);
        }

        // Create the event
        const newEvent = new this.eventModel(event);
        
        try {
            await newEvent.save();
            await Promise.all(club_ids.map(clubId => 
                this.clubModel.findByIdAndUpdate(clubId, { $push: { events: newEvent._id } })
            ));
        } catch (error) {
            throw new NotFoundException(`Error creating event: ${error}`);
        }


        return newEvent;
    }

    
    

}
