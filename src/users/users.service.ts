import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

    async getClubs() : Promise<IUser[]> {
        return await this.userModel.find();
    }

    async create(club: CreateUserDto): Promise<IUser> {
        const oldClub = await this.userModel.findOne({ name: { $regex: club.name , $options: 'i' } });
        if (oldClub) {
            throw new NotFoundException(`Club ${club.name} already exists`);
        }
        
        const hashedPassword = await bcrypt.hash(club.password, 10);

        club.password = hashedPassword;

        const newClub = new this.userModel(club);
        try {
            await newClub.save();
        } catch (err){
            if (err.code === 11000) {
                throw new BadRequestException('Email should be unique for a given Club');
            }
            throw new BadRequestException('Could not create club');
        }

        
        return newClub;
    }

    async delete(id: string): Promise<IUser> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const club = await this.userModel.findById(id);
        if (!club) {
            throw new NotFoundException(`Club with ID ${id} not found`);
        }
        await this.userModel.deleteOne({ _id: id });
        return club;
    }


    async getClub(name: string): Promise<IUser> {
        return await this.userModel.findOne({ name: { $regex: name , $options: 'i' } });
    }

    async findById(id: string): Promise<IUser> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const club = await this.userModel.findById(id);
        if (!club) {
            return null ;
        }
        return club;
    }
    
    
}
