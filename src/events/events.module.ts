import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { ClubsModule } from '../clubs/clubs.module';
import { StudentsModule } from 'src/students/students.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]), ClubsModule, StudentsModule, MailModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService, MongooseModule]
})
export class EventsModule {}