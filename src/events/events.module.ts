import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { ClubsModule } from '../clubs/clubs.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]), ClubsModule, StudentsModule],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}