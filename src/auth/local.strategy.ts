import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(name: string, password: string): Promise<any> {
    const club = await this.authService.validateClub(name, password);

    if (!club) {
      throw new UnauthorizedException();
    }

    return club;
  }
}
