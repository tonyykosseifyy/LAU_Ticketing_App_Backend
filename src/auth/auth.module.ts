import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClubsModule } from '../clubs/clubs.module';


@Module({
  imports: [ClubsModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
