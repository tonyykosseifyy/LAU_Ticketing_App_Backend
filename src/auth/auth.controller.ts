import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.auth.guard';
import { Request } from 'express';
import { VerifyDto, ForgotPasswordReqDto, ResetPasswordDto } from "./dto/index.dto"; 
import { IClub, IClubResponse } from 'src/users/interface/user.interface';
import { AuthenticatedRequest, LoginRequest } from '../interface/request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('logout')
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() request: LoginRequest): Promise<IClubResponse> {
    return this.authService.login(request);
  }

  @Get('/me')
  getMe(@Req() request: AuthenticatedRequest): IClubResponse {
    const club = request.user;
    const returned_club: IClubResponse = {
      _id: club._id,
      name: club.name,
      email: club.email,
    }
    return returned_club;
  }

  @Post('/verify')
  verify(@Body() verifyDto: VerifyDto, @Req() req: Request): Promise<IClubResponse> {
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
