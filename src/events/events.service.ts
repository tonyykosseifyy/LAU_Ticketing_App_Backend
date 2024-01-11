import { Injectable, NotFoundException } from '@nestjs/common';
import { IEvent } from './interface/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IClub } from '../clubs/interface/club.interface';
import { CreateEventDto, ScanEventDto } from './dto/index.dto';
import { IStudent } from '../students/interface/student.interface';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel('Event') private readonly eventModel: Model<IEvent>,
        @InjectModel('Club') private readonly clubModel: Model<IClub>,
        @InjectModel('Student') private readonly studentModel: Model<IStudent>
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

    async scanEvent(scanEventDto: ScanEventDto, eventId: string) {
        const event = await this.eventModel.findById(eventId);
        if( !event ) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        const { student_id, name } = scanEventDto;
        
        const student = await this.studentModel.findOne({ student_id });
        // if student is not in database and name not provided
        if ( !student && !name ) {
            throw new NotFoundException(`Student with ID ${student_id} not found, Please provide a name`);
        }

        // if student not in database but name is provided
        if ( !student && name ) {
            const newStudent = new this.studentModel({ student_id, name });
            await newStudent.save();
        }

        await this.registerStudent(scanEventDto, eventId);
        return { student, event };
    }

    async registerStudent(scanEventDto: ScanEventDto, eventId: string) {
        // student and event in database
        
        const { student_id  } = scanEventDto;

        const student = await this.studentModel.findOne({ student_id }); 
        const event = await this.eventModel.findById(eventId);

        if ( student.attendedEvents.includes(eventId) ) {
            throw new NotFoundException(`Student with ID ${student_id} already registered for this event`);
        }
        if ( !student.attendedEvents.includes(eventId) ) {
            student.attendedEvents.push(eventId);
            await student.save();
        }
        if ( !event.attendees.includes(student._id) ) {
            event.attendees.push(student._id);
            await event.save();
        }
    }

    async getEventAttendees(eventId: string): Promise<IStudent[]> {
        const event = await this.eventModel.findById(eventId).populate({
            path: 'attendees',
            model: 'Student'
        });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
        return event.attendees as unknown[] as IStudent[];
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

