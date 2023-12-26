import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly clubsService: ClubsService) {}

  async validateClub(name: string, password: string): Promise<any> {
    const club = await this.clubsService.getClub(name);
    const passwordValid = await bcrypt.compare(password, club.password);

    if (!club) {
        throw new NotAcceptableException('Could not find the club');
      }
    if (club && passwordValid) {
      return {
        clubId: club._id,
        clubName: club.name
      };
    }
    return null;
  }

}

