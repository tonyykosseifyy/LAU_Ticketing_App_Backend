import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClubsModule } from './clubs/clubs.module';
import { ClubSchema } from './clubs/schemas/club.schema';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { EventSchema } from './events/schemas/event.schema';
import { MailModule } from './mail/mail.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`,{dbName: 'LAU_EVENTS'}),
    MongooseModule.forFeature([{ name: 'Club', schema: ClubSchema }]),
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    ClubsModule,
    AuthModule,
    EventsModule,
    MailModule  
  ],
})

export class AppModule {}
