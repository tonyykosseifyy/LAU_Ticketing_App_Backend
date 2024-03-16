import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISession } from './interface/session.interface';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionsService {
    constructor(
        @InjectModel('Session') private readonly sessionModel: Model<ISession>,
        private readonly usersService: UsersService
    ) {}

    async attachUser(session_id: string, user_id: string) {
        if (!isValidObjectId(session_id) || !isValidObjectId(user_id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const session = await this.sessionModel.findById(session_id);
        
        if (!session) {
            throw new NotFoundException("Session not Found");
        }
        
        const user = await this.usersService.findById(user_id);
        
        if (!user) {
            throw new NotFoundException("User not Found");
        }
        try {
            session.user_id = user_id;
            await session.save();
            return session;
            
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
