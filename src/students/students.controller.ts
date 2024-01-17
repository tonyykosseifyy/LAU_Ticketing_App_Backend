import { Body, Controller, Get, Put, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentIdPipe } from './validations/student-id-pipe';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {}

    @Get()
    async getAllStudents() {
        const students = await this.studentsService.getAllStudents();
        return students;
    }

    @Put(':id')
    async updateStudent(
    @Param('id', StudentIdPipe) student_id: number,
    @Body() updateStudentDto: UpdateStudentDto
  ) {

    return this.studentsService.updateStudent(updateStudentDto, student_id);
  }
}
