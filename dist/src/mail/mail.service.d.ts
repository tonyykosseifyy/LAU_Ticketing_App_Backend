import { MailerService } from '@nestjs-modules/mailer';
import { IUser } from 'src/users/interface/user.interface';
import { Attachment } from './interface/attachment';
import { IEventWithCount } from 'src/events/interface/event.interface';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendEmailVerification(user: IUser, code: string): Promise<void>;
    sendResetPassword(user: IUser, code: string): Promise<void>;
    sendEventData(event: IEventWithCount, attachment: Attachment): Promise<void>;
}
