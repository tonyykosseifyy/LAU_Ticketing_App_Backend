import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IEvent, IEventWithCount } from './interface/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IClub } from '../clubs/interface/club.interface';
import { CreateEventDto } from './dto/index.dto';
import { CronJob } from 'cron';
import { MailService } from '../mail/mail.service';
import { createEventExcelFile } from './utils/excel';
import { IScan, IScanDetailed } from '../scans/interface/scan.interface';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel('Event') private readonly eventModel: Model<IEvent>,
        @InjectModel('Club') private readonly clubModel: Model<IClub>,
        @InjectModel('Scan') private readonly scanModel: Model<IScan>,
        private readonly mailService: MailService
    ) {}


    async getClubEvents(clubId: string): Promise<IEvent[]> {
        const club = await this.clubModel.findById(clubId).populate({
            path: 'events',
            model: 'Event'
        });
        
        if (!club) {
            throw new NotFoundException(`Club with ID ${clubId} not found`);
        }

        return club.events as unknown[] as IEvent[];
    }

    async createEvent(event: CreateEventDto): Promise<IEvent> {
        // check if the event name is already taken
        const oldEvent = await this.eventModel.findOne({ name: { $regex: event.name , $options: 'i' } });
        if (oldEvent) {
            throw new BadRequestException(`${event.name} Event already exists`);
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
        
        // cron job 
        this.scheduleEventEndTask(new Date(newEvent.end_date), newEvent._id);

        return newEvent;
    }  
    
    scheduleEventEndTask(endDate: Date, eventId: string) {
        const job = new CronJob(endDate, () => {
          this.handleEventEnd(eventId);
        });
        job.start();
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

