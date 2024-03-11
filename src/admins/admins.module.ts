import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [UsersModule, EventsModule, StudentsModule],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
