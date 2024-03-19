import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
export declare class Session extends PassportSerializer {
    private readonly usersService;
    constructor(usersService: UsersService);
    serializeUser(user: any, done: (err: Error, id: any) => void): void;
    deserializeUser(id: string, done: (err: Error, user: any) => void): void;
}
