import { Injectable,  } from '@nestjs/common';
import { IStudent } from './interface/student.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StudentsService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
    ) {}

    async getAllStudents(): Promise<IStudent[]> {
        const students = await this.studentModel.find();
        return students;
    }

    async getStudentById(studentId: string): Promise<IStudent> {
        const student = await this.studentModel.findOne({ studentId });
        return student;
    }

}
