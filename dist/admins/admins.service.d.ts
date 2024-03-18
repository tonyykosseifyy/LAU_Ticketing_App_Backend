import { IEvent } from '../events/interface/event.interface';
import { EventsService } from '../events/events.service';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';
import { CreateEventDtoAdmin } from 'src/events/dto/index.dto';
import { IStudent } from 'src/students/interface/student.interface';
import { StudentsService } from 'src/students/students.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { UpdateStudentDto } from 'src/students/dto/update-student.dto';
export declare class AdminsService {
    private readonly eventsService;
    private readonly usersService;
    private readonly studentsService;
    private readonly sessions;
    constructor(eventsService: EventsService, usersService: UsersService, studentsService: StudentsService, sessions: SessionsService);
    getAllEvents(): Promise<IEvent[]>;
    getEventById(eventId: string): Promise<IEvent>;
    createEvent(createEventDto: CreateEventDtoAdmin): Promise<IEvent>;
    updateEvent(eventId: string, payload: UpdateEventDto): Promise<IEvent>;
    deleteEvent(eventId: string): Promise<IEvent>;
    getAllUsers(): Promise<IUser[]>;
    getDetailedUsers(): Promise<IUser[]>;
    getUserById(userId: string): Promise<IUser | null>;
    registerUser(user: CreateUserDto): Promise<IUser>;
    updateUser(newUser: UpdateUserDto, userId: string): Promise<IUser>;
    deleteUser(userId: string): Promise<IUser>;
    getStudents(): Promise<IStudent[]>;
    getStudentById(student_id: number): Promise<IStudent>;
    updateStudent(updateStudentDto: UpdateStudentDto, student_id: number): Promise<IStudent>;
    createStudent(student: CreateStudentDto): Promise<IStudent>;
    deleteStudent(student_id: number): Promise<void>;
}