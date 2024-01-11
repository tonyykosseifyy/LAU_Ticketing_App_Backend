import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {}

    @Get()
    async getAllStudents() {
        const students = await this.studentsService.getAllStudents();
        return students;
    }

}
