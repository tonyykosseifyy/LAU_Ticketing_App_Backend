import { Injectable, NotFoundException } from '@nestjs/common';
import { IStudent } from './interface/student.interface';
import { IStudentProtected } from './interface/protected-student.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateStudentDto } from './dto/update-student.dto'; 

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

    async updateStudent(updateStudentDto: UpdateStudentDto, student_id: number): Promise<any> {
        const { name } = updateStudentDto ;
        
        const student: IStudentProtected = await this.studentModel.findOne({
            student_id
        });
        if (!student) {
            throw new NotFoundException(`Student with ID: ${student_id} does not exist.`);
        }   
        student.name = name ;
        await student.save();

        let returned_student = {
            student_id,
            name
        }
        return returned_student ;
    }


}
