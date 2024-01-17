import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanEventDto } from './dto/scan-event.dto';
import { IEvent } from '../events/interface/event.interface';
import { IStudent } from 'src/students/interface/student.interface';
import { IScan, IScanDetailed } from './interface/scan.interface';
import { AuthenticatedRequest } from 'src/interface/request.interface';
import { Attendee } from './interface/attendee.interface';

@Injectable()
export class ScansService {
  constructor(
    @InjectModel('Scan') private readonly scanModel: Model<IScan>,
    @InjectModel('Event') private readonly eventModel: Model<IEvent>,
    @InjectModel('Student') private readonly studentModel: Model<IStudent>
  ) {}

  
  async scanEvent(scanEventDto: ScanEventDto, eventId: string, request: AuthenticatedRequest): Promise<void> {
    const club = request.user;

    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    
    if ( !event.clubs.includes(club._id) ) {
      throw new NotFoundException(`Club is not part of this event`);
    }

    // check that the date now if between the start and end date of the event
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate || now > endDate) {
      throw new NotFoundException(`${event.name} event is not active`);
    }

    const { student_id, name } = scanEventDto;
    let student = await this.studentModel.findOne({ student_id });
    // if student is not in database and name not provided
    if (!student && !name) {
      throw new NotFoundException(
        `Student with ID ${student_id} not found, Please provide a name`,
      );
    }
    // if student not in database but name is provided
    if (!student && name) {
      student = new this.studentModel({ student_id, name });
      await student.save();
    }
    // after student is present in database

    const oldScan = await this.scanModel.findOne({ student: student._id, event: eventId });
    if (oldScan) {
        throw new BadRequestException(`Student already scanned this event`);
    }

    const scan = new this.scanModel({
        student: student._id,
        event: eventId,
        date: now
    });

    await scan.save();
  } 

  async getEventAttendees(eventId: string, request: AuthenticatedRequest): Promise<Attendee[]> {
    const club = request.user ;

    const event = await this.eventModel.findById(eventId);
    if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    // check if club is part of the event
    if ( !event.clubs.includes(club._id) ) {
        throw new NotFoundException(`Club is not part of this event`);
    }
    
    // get all scans of the event
    const scans: IScanDetailed[] = await this.scanModel.find({ event: eventId }).populate({
        path: 'student',
        model: 'Student',
        select: 'name student_id _id'
    });

    if (!scans) {
        throw new NotFoundException(`No scans found for this ${event.name}} event`);
    }

    return scans.map(scan => scan.student);
    }    
}
