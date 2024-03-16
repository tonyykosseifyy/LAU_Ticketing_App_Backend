import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { VerifyDto, ForgotPasswordReqDto, ResetPasswordDto } from "./dto/index.dto"; 
import { IUserResponse } from 'src/users/interface/user.interface';
import { LoginRequest } from 'src/interface/request.interface';

const otpGenerator = require('otp-generator');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  async forgotPassword(forgotPasswordReqDto: ForgotPasswordReqDto) {
    const { name, email } = forgotPasswordReqDto;
    const user = await this.usersService.getUser(name);

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (user.email !== email) {
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

    user.code = hash;
    // 15 min
    user.expiresAt = new Date(Date.now() + 900000);

    try {
      await user.save();
      // send verification code via email
      await this.mailService.sendResetPassword(user, verificationCode);
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

    const user = await this.usersService.getUser(name);
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (!user.code || !user.expiresAt) {
      throw new HttpException('Please go to forgot password first', HttpStatus.BAD_REQUEST);
    }

    const codeMatch: boolean = await bcrypt.compare(code, user.code);
    if (!codeMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (user.expiresAt < new Date(Date.now())) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }
    const newPassword = await bcrypt.hash(password, 10);

    user.verified = true;
    user.password = newPassword;
    user.code = null;
    user.expiresAt = null;

    await user.save();

    return {
      message: 'Password reset successful',
      statusCode: HttpStatus.OK,
    };
  }

  async verify(verifyDto: VerifyDto, req): Promise<IUserResponse> {
    const { name, code, password } = verifyDto;

    const user = await this.usersService.getUser(name);

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (user.verified) {
      throw new HttpException('Already verified', HttpStatus.BAD_REQUEST);
    }
    if (!user.code || !user.expiresAt) {
      throw new HttpException('Please login first', HttpStatus.BAD_REQUEST);
    }

    const codeMatch: boolean = await bcrypt.compare(code, user.code);
    if (!codeMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (user.expiresAt < new Date(Date.now())) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }
    const newPassword = await bcrypt.hash(password, 10);

    user.verified = true;
    user.password = newPassword;
    user.code = null;
    user.expiresAt = null;

    await user.save();

    let returned_user: IUserResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
    // generate a session cookie
    return new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) {
          reject(err);
        }
        // req.session.userID = user._id;
        resolve(returned_user);
      });
    });
  }

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(name);
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const passwordMatch: boolean = await this.passwordMatch(
      password,
      user.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    if (!user.verified) {
      // generate verification code
      const verificationCode = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      // hash verification code
      const hash = await bcrypt.hash(verificationCode, 10);

      user.code = hash;
      // 15 min
      user.expiresAt = new Date(Date.now() + 900000);

      await user.save();
      // send verification code via email
      await this.mailService.sendEmailVerification(user, verificationCode);

      throw new HttpException(
        'A 6-digit verification code has been sent to your email. Please check your email for verification.',
        HttpStatus.ACCEPTED,
      );
    }

    return {
      user,
    };
  }

  async passwordMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(@Req() request: LoginRequest): Promise<IUserResponse> {
    let { user } = request.user;
    // return user without code, expires at, password, events fields
    
    const returned_user: IUserResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
}

    return returned_user as any as IUserResponse;
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
