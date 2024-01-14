import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IClub } from 'src/clubs/interface/club.interface';
import { IEvent } from 'src/events/interface/event.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerification(club: IClub, code: string) {
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

  async sendResetPassword(club: IClub, code: string) {
    await this.mailerService.sendMail({
      to: club.email,
      subject: 'Password Reset Request',
      template: './reset-password',
      context: {
        name: club.name,
        code,
      },
    });
  }
  async sendEventData(event: IEvent) {
    await this.mailerService.sendMail({
      // Alan's email
      to: 'tony.elkosseify@lau.edu',
      subject: 'Event Summary and Attendee Insights',
      template: './event-data',
      context: {
        name: event.name,
      },
    });
  }
}
