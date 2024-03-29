import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from './schemas/user.schema';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }]), EventsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule]
})

export class UsersModule {}
