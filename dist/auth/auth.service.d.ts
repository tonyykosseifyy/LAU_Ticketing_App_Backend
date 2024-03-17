import { HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { VerifyDto, ForgotPasswordReqDto, ResetPasswordDto } from "./dto/index.dto";
import { IUserResponse } from 'src/users/interface/user.interface';
import { LoginRequest } from 'src/interface/request.interface';
import { SessionsService } from 'src/sessions/sessions.service';
export declare class AuthService {
    private readonly usersService;
    private readonly mailService;
    private readonly sessionService;
    constructor(usersService: UsersService, mailService: MailService, sessionService: SessionsService);
    forgotPassword(forgotPasswordReqDto: ForgotPasswordReqDto): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
    verify(verifyDto: VerifyDto, request: any): Promise<IUserResponse>;
    validateUser(name: string, password: string): Promise<any>;
    passwordMatch(password: string, hash: string): Promise<boolean>;
    login(request: LoginRequest): Promise<IUserResponse>;
    logout(request: Request): Promise<any>;
}
