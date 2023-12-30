import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';

const otpGenerator = require( 'otp-generator');

@Injectable()
export class AuthService {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly mailService: MailService  
  ) {}

  async validateClub(name: string, password: string): Promise<any> {
    const club = await this.clubsService.getClub(name);
    if (!club)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const passwordMatch: boolean = await this.passworMatch(
      password,
      club.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    
    if(!club.verified) {
      // generate verification code
      const verificationCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

      club.code = verificationCode;
      // 15 min
      club.expiresAt = new Date(Date.now() + 900000);

      await club.save();
      // send verification code via email
      await this.mailService.sendUserCode(club, verificationCode);

      throw new HttpException(
        'A 6-digit verification code has been sent to your email. Please check your email for verification.', 
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      club
    };
  }

  async passworMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login() {
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
    };
  }

  async logout(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
