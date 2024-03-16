import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MailModule } from './mail/mail.module';
import { StudentsModule } from './students/students.module';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { ScansModule } from './scans/scans.module';
import { AdminsModule } from './admins/admins.module';
import { SessionsModule } from './sessions/sessions.module';


@Module({
  controllers: [AppController],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`,
      { dbName: 'LAU_EVENTS' },
    ),
    UsersModule,
    AuthModule,
    EventsModule,
    MailModule,
    StudentsModule,
    ScansModule,
    AdminsModule,
    SessionsModule,
  ],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
