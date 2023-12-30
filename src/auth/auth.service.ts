import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { IcalAttachment } from 'nodemailer/lib/mailer';
import { VerifyDto } from './dto/verify-code.dto';

const otpGenerator = require( 'otp-generator');

@Injectable()
export class AuthService {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly mailService: MailService  
  ) {}

  async verify(verifyDto: VerifyDto, req ) {
    const { name, code } = verifyDto;

    const club = await this.clubsService.getClub(name);

    if (!club)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (club.verified) {
      throw new HttpException('Already verified', HttpStatus.BAD_REQUEST);
    }

    const codeMatch: boolean = await bcrypt.compare(code, club.code);
    if (!codeMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    
    if (club.expiresAt < new Date(Date.now())) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }

    club.verified = true;
    club.code = null;
    club.expiresAt = null;
    await club.save();
    
    req.login(club, (err) => {
      if (err) {
          throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });


    return {
      message: 'Verification successful',
      statusCode: HttpStatus.OK,
    };
  }

  async validateClub(name: string, password: string): Promise<any> {
    const club = await this.clubsService.getClub(name);
    if (!club)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const passwordMatch: boolean = await this.passwordMatch(
      password,
      club.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    
    if(!club.verified) {
      // generate verification code
      const verificationCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

      // hash verification code
      const hash = await bcrypt.hash(verificationCode, 10);

      club.code = hash;
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

  async passwordMatch(password: string, hash: string): Promise<boolean> {
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
