import { Body, Controller, Get, Put } from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {}

    @Get()
    async getAllStudents() {
        const students = await this.studentsService.getAllStudents();
        return students;
    }

    @Put()
    async updateStudent(@Body() updateStudentDto: UpdateStudentDto) {
        return this.studentsService.updateStudent(updateStudentDto);
    }
}
