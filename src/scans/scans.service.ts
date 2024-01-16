import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanEventDto } from './dto/scan-event.dto';
import { IEvent } from '../events/interface/event.interface';
import { IStudent } from 'src/students/interface/student.interface';
import { IClub } from 'src/clubs/interface/club.interface';
import { IScan, IScanDetailed } from './interface/scan.interface';

@Injectable()
export class ScansService {
  constructor(
    @InjectModel('Scan') private readonly scanModel: Model<IScan>,
    @InjectModel('Event') private readonly eventModel: Model<IEvent>,
    @InjectModel('Student') private readonly studentModel: Model<IStudent>
  ) {}

  
  async scanEvent(scanEventDto: ScanEventDto, eventId: string) {
    const event = await this.eventModel.findById(eventId);
    console.log(1);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    console.log(2);
    // check that the date now if between the start and end date of the event
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    console.log(3);
    if (now < startDate || now > endDate) {
      throw new NotFoundException(`${event.name} event is not active`);
    }

    const { student_id, name } = scanEventDto;
    console.log(4);
    const student = await this.studentModel.findOne({ student_id });
    // if student is not in database and name not provided
    console.log(5);
    if (!student && !name) {
      throw new NotFoundException(
        `Student with ID ${student_id} not found, Please provide a name`,
      );
    }
    console.log(6);
    // if student not in database but name is provided
    if (!student && name) {
      const newStudent = new this.studentModel({ student_id, name });
      await newStudent.save();
    }
    // after student is present in database
    console.log(7);
    const scan = new this.scanModel({
        student: student._id,
        event: eventId,
        date: new Date()
    });


    await scan.save();
    console.log(8);
    return { student, event };
  } 

  async getEventAttendees(eventId: string, club: IClub): Promise<{student_id: number,name: string}[]> {
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
