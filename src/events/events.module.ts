import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { UsersModule } from '../users/users.module';
import { StudentsModule } from 'src/students/students.module';
import { MailModule } from '../mail/mail.module';
import { ScansModule } from 'src/scans/scans.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]), UsersModule, StudentsModule, MailModule, ScansModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService, MongooseModule]
})
export class EventsModule {}