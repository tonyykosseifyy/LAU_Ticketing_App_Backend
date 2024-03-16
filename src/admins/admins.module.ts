import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { StudentsModule } from 'src/students/students.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [UsersModule, EventsModule, StudentsModule, SessionsModule],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
