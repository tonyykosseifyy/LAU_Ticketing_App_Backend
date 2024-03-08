import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClubsModule } from './clubs/clubs.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MailModule } from './mail/mail.module';
import { StudentsModule } from './students/students.module';
import { ClubsService } from './clubs/clubs.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { ScansModule } from './scans/scans.module';
import { AdminsModule } from './admins/admins.module';


@Module({
  controllers: [AppController],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`,
      { dbName: 'LAU_EVENTS' },
    ),
    ClubsModule,
    AuthModule,
    EventsModule,
    MailModule,
    StudentsModule,
    ScansModule,
    AdminsModule
  ],
  providers: [
    AppService,
    ClubsService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
