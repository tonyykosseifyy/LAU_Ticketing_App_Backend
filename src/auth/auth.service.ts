import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import * as bcrypt from 'bcrypt';
import { ClubSchema } from 'src/clubs/schemas/club.schema';

@Injectable()
export class AuthService {
  constructor(private readonly clubsService: ClubsService) {}

}

