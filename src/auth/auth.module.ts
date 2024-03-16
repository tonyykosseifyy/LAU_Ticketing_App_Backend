import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { Session } from './session.serializer';
import { MailModule } from '../mail/mail.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true }), MailModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}