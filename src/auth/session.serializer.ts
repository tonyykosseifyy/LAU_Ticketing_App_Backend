import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ClubsService } from 'src/clubs/clubs.service';

@Injectable()
export class Session extends PassportSerializer {
  constructor(private readonly clubsService: ClubsService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, id: any) => void): void {
    done(null, user._id || user.club._id);  // Assuming user has an _id field
  }
  

  deserializeUser(id: string, done: (err: Error, user: any) => void): void {
    this.clubsService.findById(id).then(
      (user) => done(null, user),
      (error) => done(error, null)
    );
  }
  
}