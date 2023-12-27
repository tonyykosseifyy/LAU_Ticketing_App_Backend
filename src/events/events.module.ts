import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Event", schema: EventSchema }])],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
