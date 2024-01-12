import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.auth.guard';
import { Request } from 'express';
import { VerifyDto, ForgotPasswordReqDto, ResetPasswordDto } from "./dto/index.dto"; 
import { IClub } from 'src/clubs/interface/club.interface';
import { AuthenticatedRequest } from '../interface/request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('logout')
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() request: AuthenticatedRequest): Promise<IClub> {
    return this.authService.login(request);
  }

  @Get('/me')
  getMe(@Req() request: Request): any {
    return request.user;
  }

  @Post('/verify')
  verify(@Body() verifyDto: VerifyDto, @Req() req: Request): Promise<any> {
    return this.authService.verify(verifyDto, req);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordReqDto: ForgotPasswordReqDto): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordReqDto);
  }

  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
