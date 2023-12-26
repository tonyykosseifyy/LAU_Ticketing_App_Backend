import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IClub } from './interface/club.interface';
import { CreateClubDto } from './dto/create-club.dto';

@Injectable()
export class ClubsService {
    constructor(@InjectModel('Club') private readonly clubModel: Model<IClub>) {}

    async getClubs() : Promise<IClub[]> {
        return await this.clubModel.find();
    }

    async create(club: CreateClubDto): Promise<IClub> {
        const oldClub = await this.clubModel.findOne({ name: { $regex: club.name , $options: 'i' } });
        if (oldClub) {
            throw new NotFoundException(`Club ${club.name} already exists`);
        }
        const newClub = new this.clubModel(club);
        return await newClub.save();
    }

    async delete(id: string): Promise<IClub> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const club = await this.clubModel.findById(id);
        if (!club) {
            throw new NotFoundException(`Club with ID ${id} not found`);
        }
        await this.clubModel.deleteOne({ _id: id });
        return club;
    }
    
}
