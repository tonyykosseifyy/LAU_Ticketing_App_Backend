import { AuthService } from './auth.service';
import { Request } from 'express';
import { VerifyDto, ForgotPasswordReqDto, ResetPasswordDto } from "./dto/index.dto";
import { IUserResponse } from 'src/users/interface/user.interface';
import { AuthenticatedRequest, LoginRequest } from '../interface/request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    logout(request: Request): Promise<any>;
    login(request: LoginRequest): Promise<IUserResponse>;
    getMe(request: AuthenticatedRequest): IUserResponse;
    verify(verifyDto: VerifyDto, req: Request): Promise<IUserResponse>;
    forgotPassword(forgotPasswordReqDto: ForgotPasswordReqDto): Promise<any>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any>;
}
