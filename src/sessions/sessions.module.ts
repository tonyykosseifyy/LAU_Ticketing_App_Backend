import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionSchema } from './schemas/session.schema';
import { MongooseModule } from "@nestjs/mongoose"
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Session", schema: SessionSchema }]), UsersModule],
  providers: [SessionsService],
  exports: [SessionsService]
})
export class SessionsModule {}
