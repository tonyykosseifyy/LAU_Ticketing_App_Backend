import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClubsModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { Session } from './session.serializer';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ClubsModule, PassportModule.register({ session: true }), MailModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}