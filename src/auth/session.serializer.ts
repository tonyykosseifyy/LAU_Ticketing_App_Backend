import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class Session extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, id: any) => void): void {
    done(null, user._id || user.user._id);  // Assuming user has an _id field
  }
  

  deserializeUser(id: string, done: (err: Error, user: any) => void): void {
    this.usersService.findById(id).then(
      (user) => done(null, user),
      (error) => done(error, null)
    );
  }
}