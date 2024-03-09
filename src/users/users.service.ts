import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

    async getUsers() : Promise<IUser[]> {
        return await this.userModel.find();
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

    async delete(id: string): Promise<IUser> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(`Club with ID ${id} not found`);
        }
        await this.userModel.deleteOne({ _id: id });
        return user;
    }


    async getUser(name: string): Promise<IUser> {
        return await this.userModel.findOne({ name: { $regex: name , $options: 'i' } });
    }

    async findById(id: string): Promise<IUser> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            return null ;
        }
        return user;
    }
}