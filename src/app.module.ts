import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClubsModule } from './clubs/clubs.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MailModule } from './mail/mail.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`,
      { dbName: 'LAU_EVENTS' },
    ),
    ClubsModule,
    AuthModule,
    EventsModule,
    MailModule,
  ],
})
export class AppModule {}
