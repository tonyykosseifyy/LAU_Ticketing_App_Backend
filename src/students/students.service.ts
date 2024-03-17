import { Injectable, NotFoundException } from '@nestjs/common';
import { IStudent } from './interface/student.interface';
import { IStudentProtected } from './interface/protected-student.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateStudentDto } from './dto/update-student.dto'; 
import { CreateStudentDto } from './dto/create-student.dto';
import { ScansService } from 'src/scans/scans.service';

@Injectable()
export class StudentsService {
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<IStudent>,
        private readonly scans: ScansService
    ) {}

    async getAllStudents(): Promise<IStudent[]> {
        const students = await this.studentModel.find().sort({ name: 1 });
        return students;
    }

    async getStudentById(student_id: number): Promise<IStudent> {
        const student = await this.studentModel.findOne({ student_id });
        return student;
    }

    async updateStudent(updateStudentDto: UpdateStudentDto, student_id: number): Promise<IStudent> {
        const { name } = updateStudentDto ;
        const student = await this.studentModel.findOneAndUpdate({ student_id }, { name }, { new: true });

        if (!student) {
            throw new NotFoundException(`Student with ID: ${student_id} does not exist.`);
        }   

        return student ;
    }

    async createStudent(student: CreateStudentDto): Promise<IStudent> {
        const { student_id } = student ;

        const studentExist = await this.studentModel.findOne({ student_id });
        if (studentExist) {
            throw new NotFoundException(`Student with ID: ${student_id} already exists.`);
        }

        const newStudent = new this.studentModel(student);
        return await newStudent.save();
    }

    async deleteStudent(student_id: number): Promise<void> {
        await this.scans.deleteStudentScans(student_id);

        const deleted_student = await this.studentModel.findOneAndDelete({ student_id });

        if (!deleted_student) {
            throw new NotFoundException(`Student with ID: ${student_id} does not exist.`);
        }

    }

}
