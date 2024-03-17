import { Injectable } from '@nestjs/common';
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
import { NotFoundException } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { UpdateStudentDto } from 'src/students/dto/update-student.dto';

@Injectable()
export class AdminsService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
        private readonly studentsService: StudentsService,
        private readonly sessions: SessionsService
    ) {}
        

    // GET All Events
    async getAllEvents(): Promise<IEvent[]> {
        return await this.eventsService.getAllEvents();
    }
    // GET Event By Id
    async getEventById(eventId: string): Promise<IEvent> {
        return await this.eventsService.getEventById(eventId);
    }
    // Create Event 
    async createEvent(createEventDto: CreateEventDtoAdmin) {
        return await this.eventsService.createAdminEvent(createEventDto);
    }
    // Update Event
    async updateEvent(eventId: string, payload: UpdateEventDto): Promise<IEvent> {
        return await this.eventsService.updateEvent(eventId, payload);
    }

    // Delete Event 
    async deleteEvent(eventId: string): Promise<IEvent> {
        return await this.eventsService.deleteEventAdmin(eventId);
    }
    // --------------------------------------------------------------------------------------------
    
    // GET All Users
    async getAllUsers(): Promise<IUser[]> {
        return await this.usersService.getAllUsers();
    }

    // GET Detailed Users
    async getDetailedUsers(): Promise<IUser[]> {
        return await this.usersService.getDetailedUsers();
    }
    // GET User By Id
    async getUserById(userId: string): Promise<IUser | null> {
        return await this.usersService.findById(userId);
    }
    // Register User 
    async registerUser(user: CreateUserDto): Promise<IUser> {
        return await this.usersService.create(user);
    }

    // Update User 
    async updateUser(newUser: UpdateUserDto, userId: string): Promise<IUser> {
        const { email } = newUser ;
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException(`User ${userId} does not exist`);
        }

        if (email && email != user.email) {
            // log out all sessions
            await this.sessions.deleteUserSessions(userId);
        }
        return await this.usersService.update(newUser, userId);
    }
    
    // Delete User
    async deleteUser(userId: string): Promise<IUser> {
        return await this.usersService.delete(userId);
    }

    // --------------------------------------------------------------------------------------------


    // GET Students
    async getStudents(): Promise<IStudent[]> {
        return await this.studentsService.getAllStudents();
    }

    // GET Student By Id
    async getStudentById(student_id: number): Promise<IStudent> {
        return await this.studentsService.getStudentById(student_id);
    }

    // Update Student 
    async updateStudent(updateStudentDto: UpdateStudentDto, student_id: number): Promise<IStudent> {
        return await this.studentsService.updateStudent(updateStudentDto, student_id);
    }

    // Create Student
    async createStudent(student: CreateStudentDto): Promise<IStudent> {
        return await this.studentsService.createStudent(student);
    }

    // Delete Student
    async deleteStudent(student_id: number): Promise<void> {
        return await this.studentsService.deleteStudent(student_id);
    }



    

    

}
