import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IClub } from 'src/clubs/interface/club.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(club: IClub, code: string) {

    await this.mailerService.sendMail({
      to: club.email,
      subject: 'Welcome to LAU Event App! Confirm your Email',
      template: './confirmation', 
      context: { 
        name: club.name,
        code,
      },
    });
  }
}
