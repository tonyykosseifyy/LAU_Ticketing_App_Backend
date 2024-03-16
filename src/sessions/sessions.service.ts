import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISession } from './interface/session.interface';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class SessionsService {
    constructor(
        @InjectModel('Session') private readonly sessionModel: Model<ISession>,
        private readonly usersService: UsersService
    ) {}

    async attachUser(session_id: string, user_id: string) {
        if (!isValidObjectId(user_id)) {
            throw new BadRequestException('Invalid User id format');
        }
        const session = await this.sessionModel.findOne({ _id: session_id });
        
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
    async deleteUserSessions(session_id: string, user_id: string) {
        if (!isValidObjectId(user_id)) {
            throw new BadRequestException('Invalid User id format');
        }
        try {
        await this.sessionModel.deleteMany({ user_id: session_id });

        } catch(err) {
            throw new BadRequestException(err);
        }
    }
}
