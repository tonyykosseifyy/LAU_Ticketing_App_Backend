import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    getAllStudents(): Promise<import("./interface/student.interface").IStudent[]>;
    updateStudent(student_id: number, updateStudentDto: UpdateStudentDto): Promise<import("./interface/student.interface").IStudent>;
}
