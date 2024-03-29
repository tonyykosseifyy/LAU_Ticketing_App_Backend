import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { EventsService } from 'src/events/events.service';


interface IDetailedUser extends IUser {
    numberOfEvents: number;
}
    

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        private readonly eventsService: EventsService
        ) {}

    async getAllUsers() : Promise<IUser[]> {
        return await this.userModel.find({ role: 'user' }).sort({ name: 1 });
    }

    async getDetailedUsers(): Promise<IUser[]> {
        // get all user (name, total number of attendees, number of events, how many days ago was the last event)
        const users : IDetailedUser[] = await this.userModel.find({role: "user"})
        .sort({ name: 1 })
        .lean() ;

        users.forEach(async (user) => {
            user.numberOfEvents = user.events.length;
        });

        return users ;
    }

    async create(user: CreateUserDto): Promise<IUser> {
        const oldUser = await this.userModel.findOne({ name: { $regex: user.name , $options: 'i' } });
        if (oldUser) {
            throw new NotFoundException(`User ${user.name} already exists`);
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10);

        user.password = hashedPassword;

        const newUser = new this.userModel(user);
        try {
            await newUser.save();
        } catch (err){
            if (err.code === 11000) {
                throw new BadRequestException('Email should be unique for a given Club');
            }
            throw new BadRequestException('Could not create user');
        }

        
        return newUser;
    }

    
    async update(newUser: UpdateUserDto, user_id: string): Promise<IUser> { // Adjust return type to your User document type
        const newUserv2 = {
            ...newUser,
            verified: false
        }
        if (!isValidObjectId(user_id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const options = { new: true }; 
        const modifiedUser = await this.userModel.findOneAndUpdate({ _id: user_id }, newUserv2, options);
        if (!modifiedUser) {
            throw new NotFoundException(`User with ID ${user_id} not found`);
        }
        return modifiedUser;
    }
    

    async delete(id: string): Promise<IUser> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(`Club with ID ${id} not found`);
        }

        // delete all events associated with the user
        await this.eventsService.deleteMultipleEvents(user.events);
        
        // delete user
        await this.userModel.deleteOne({ _id: id });
        return user;
    }

    
    

    async getUser(name: string): Promise<IUser> {
        return await this.userModel.findOne({ name: { $regex: name , $options: 'i' } });
    }

    async findById(id: string): Promise<IUser | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const user = await this.userModel.findById(id).populate({
            path: 'events',
            model: 'Event'
        });
        

        if (!user) {
            return null ;
        }
        return user;
    }
}
