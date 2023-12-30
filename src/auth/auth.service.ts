import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly clubsService: ClubsService) {}

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
