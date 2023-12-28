import { Injectable } from '@nestjs/common';
import { IEvent } from './interface/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class EventsService {
    constructor(@InjectModel('Event') private readonly eventModel: Model<IEvent>) {}

    

}
