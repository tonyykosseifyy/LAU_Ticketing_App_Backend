import { AdminsService } from './admins.service';
import { UpdateEventDto } from '../events/dto/update-event.dto';
import { CreateEventDtoAdmin } from 'src/events/dto/admin-create-event.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { UpdateStudentDto } from 'src/students/dto/update-student.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    getAllEvents(response: any): Promise<any>;
    getEvent(request: any, response: any): Promise<any>;
    updateEvent(request: any, response: any, updateEventDto: UpdateEventDto): Promise<any>;
    createEvent(response: any, createEventDto: CreateEventDtoAdmin): Promise<any>;
    deleteEvent(request: any, response: any): Promise<any>;
    getAllUsers(response: any): Promise<any>;
    getDetailedUsers(response: any): Promise<any>;
    registerUser(response: any, user: CreateUserDto): Promise<any>;
    updateUser(response: any, user: UpdateUserDto, request: any): Promise<any>;
    deleteUser(request: any, response: any): Promise<any>;
    getStudents(response: any): Promise<any>;
    getStudentById(student_id: number, response: any): Promise<any>;
    updateStudent(student_id: number, response: any, updateStudentDto: UpdateStudentDto): Promise<any>;
    createStudent(response: any, createStudentDto: CreateStudentDto): Promise<any>;
    deleteStudent(student_id: number, response: any): Promise<any>;
}
