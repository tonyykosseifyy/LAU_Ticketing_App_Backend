import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { VerifyDto, ForgotPasswordReqDto, ResetPasswordDto } from "./dto/index.dto"; 

const otpGenerator = require('otp-generator');

@Injectable()
export class AuthService {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly mailService: MailService
  ) {}

  async forgotPassword(forgotPasswordReqDto: ForgotPasswordReqDto) {
    const { name, email } = forgotPasswordReqDto;
    const club = await this.clubsService.getClub(name);

    if (!club)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (club.email !== email) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    // generate verification code
    const verificationCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // hash verification code
    const hash = await bcrypt.hash(verificationCode, 10);

    club.code = hash;
    // 15 min
    club.expiresAt = new Date(Date.now() + 900000);

    try {
      await club.save();
      // send verification code via email
      await this.mailService.sendResetPassword(club, verificationCode);
      return {
        message: 'An email has been sent to you with a 6-digit code for password reset',
        statusCode: HttpStatus.OK,
      };
    } catch(err) {
      throw new HttpException('Error sending email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { name, code, password } = resetPasswordDto;

    const club = await this.clubsService.getClub(name);
    if (!club)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (!club.code || !club.expiresAt) {
      throw new HttpException('Please go to forgot password first', HttpStatus.BAD_REQUEST);
    }

    const codeMatch: boolean = await bcrypt.compare(code, club.code);
    if (!codeMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (club.expiresAt < new Date(Date.now())) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }
    const newPassword = await bcrypt.hash(password, 10);

    club.verified = true;
    club.password = newPassword;
    club.code = null;
    club.expiresAt = null;

    await club.save();

    return {
      message: 'Password reset successful',
      statusCode: HttpStatus.OK,
    };
  }

  async verify(verifyDto: VerifyDto, req) {
    const { name, code, password } = verifyDto;

    const club = await this.clubsService.getClub(name);

    if (!club)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (club.verified) {
      throw new HttpException('Already verified', HttpStatus.BAD_REQUEST);
    }
    if (!club.code || !club.expiresAt) {
      throw new HttpException('Please login first', HttpStatus.BAD_REQUEST);
    }

    const codeMatch: boolean = await bcrypt.compare(code, club.code);
    if (!codeMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (club.expiresAt < new Date(Date.now())) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }
    const newPassword = await bcrypt.hash(password, 10);

    club.verified = true;
    club.password = newPassword;
    club.code = null;
    club.expiresAt = null;

    await club.save();

    // generate a session cookie
    return new Promise((resolve, reject) => {
      req.login(club, (err) => {
        if (err) {
          reject(err);
        }
        resolve({
          message: 'Verification successful',
          statusCode: HttpStatus.OK,
        });
      });
    });
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

    if (!club.verified) {
      // generate verification code
      const verificationCode = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      // hash verification code
      const hash = await bcrypt.hash(verificationCode, 10);

      club.code = hash;
      // 15 min
      club.expiresAt = new Date(Date.now() + 900000);

      await club.save();
      // send verification code via email
      await this.mailService.sendEmailVerification(club, verificationCode);

      throw new HttpException(
        'A 6-digit verification code has been sent to your email. Please check your email for verification.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      club,
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
