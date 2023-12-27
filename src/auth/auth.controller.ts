import {
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LocalGuard } from './local.auth.guard';
  import { Request } from 'express';
  import { AuthenticatedGuard } from '../auth/authenticated.guard';

  @Controller('auth')
  export class AuthController {
    constructor( private readonly authService: AuthService) {}
  
    @Get('logout')
    logout(@Req() request: Request): Promise<any> {
      return this.authService.logout(request);
    }
    
    @UseGuards(LocalGuard)
    @Post('login')
    login(): Promise<any> {
      return this.authService.login();
    }

    @UseGuards(AuthenticatedGuard)
    @Get('me')
    getMe(@Req() request: Request): any {
      return request.user;
    }
  
  }