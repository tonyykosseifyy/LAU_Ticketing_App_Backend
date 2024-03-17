"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendEmailVerification(user, code) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to LAU Event App! Confirm your Email',
            template: './confirmation',
            context: {
                name: user.name,
                code,
            },
        });
    }
    async sendResetPassword(user, code) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            template: './reset-password',
            context: {
                name: user.name,
                code,
            },
        });
    }
    async sendEventData(event, attachment) {
        await this.mailerService.sendMail({
            to: 'tony.elkosseify@lau.edu',
            subject: 'Event Summary and Attendee Insights',
            template: './event-data',
            context: {
                name: event.name,
                start_date: new Date(event.start_date).toString().replace(/ GMT.*$/, ""),
                end_date: new Date(event.end_date).toString().replace(/ GMT.*$/, ""),
                attendee_count: event.attendee_count
            },
            attachments: [attachment]
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map