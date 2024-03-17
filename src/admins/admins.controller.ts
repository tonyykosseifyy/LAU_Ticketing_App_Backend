import { Get, Req, Res, Post, Delete, Put, Controller, Body, Param } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/user-roles';
import { UseInterceptors } from '@nestjs/common';
import { RolesInterceptor } from './interceptor';
import { UpdateEventDto } from '../events/dto/update-event.dto';
import { CreateEventDtoAdmin } from 'src/events/dto/admin-create-event.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { StudentIdPipe } from 'src/students/validations/student-id-pipe';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { UpdateStudentDto } from 'src/students/dto/update-student.dto';

@UseInterceptors(RolesInterceptor)
@Roles(UserRole.Admin)
@Controller('dashboard')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    // events
    @Get('/events')
    async getAllEvents(@Res() response) {
        try {
            const events = await this.adminsService.getAllEvents();
            return response.status(200).send({
                events,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // GET event by id
    @Get('/events/:id')
    async getEvent(@Req() request, @Res() response) {
        const eventId = request.params.id;
        try {
            const event = await this.adminsService.getEventById(eventId);
            return response.status(200).send({
                event,
            });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // Update Event
    @Put('/events/:id')
    async updateEvent(@Req() request, @Res() response, @Body() updateEventDto: UpdateEventDto,) {
        const eventId = request.params.id;
        const payload = request.body;
        try {
            const event = await this.adminsService.updateEvent(eventId, payload);
            return response.status(200).send({
                message: `Event ${eventId} has been updated successfully`,
                event,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // Create Event
    @Post('/events')
    async createEvent(@Res() response, @Body() createEventDto: CreateEventDtoAdmin) {
        try {
            const event = await this.adminsService.createEvent(createEventDto);
            return response.status(201).send({
                message: `Event has been created successfully`,
                event,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // DELETE Event By Id
    @Delete('/events/:id')
    async deleteEvent(@Req() request, @Res() response) {
        const eventId = request.params.id;
        try {
            const event = await this.adminsService.deleteEvent(eventId);
            return response.status(200).send({
                message: `Event ${eventId} has been deleted successfully`,
                event,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // GET all users
    @Get('/users')
    async getAllUsers(@Res() response) {
        try {
            const users = await this.adminsService.getAllUsers();
            return response.status(200).send({
                users,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // GET detailed users
    @Get('/users/detailed')
    async getDetailedUsers(@Res() response) {
        try {
            const users = await this.adminsService.getDetailedUsers();
            return response.status(200).send({
                users,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    
    // Register a User
    @Post('/users')
    async registerUser(@Res() response, @Body() user: CreateUserDto) {
        try {
            const newUser = await this.adminsService.registerUser(user);
            return response.status(201).send({
                message: `User ${newUser.name} has been created successfully`,
                user: newUser,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    
    // Update A User
    @Put('/users/:id')
    async updateUser(@Res() response, @Body() user: UpdateUserDto, @Req() request) {
        const userId = request.params.id;
        try {
            const newUser = await this.adminsService.updateUser(user, userId);
            return response.status(200).send({
                message: `User ${newUser.name} has been updated successfully`,
                user: newUser,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    // Delete A User 
    @Delete('/users/:id')
    async deleteUser(@Req() request, @Res() response) {
        const userId = request.params.id;
        try {
            const user = await this.adminsService.deleteUser(userId);
            return response.status(200).send({
                message: `User ${user.name} has been deleted successfully`,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    // GET Students
    @Get("/students")
    async getStudents(@Res() response) {
        try {
            const students = await this.adminsService.getStudents();
            return response.status(200).send({
                students,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    @Get("/students/:id")
    async getStudentById(@Param('id', StudentIdPipe) student_id: number, @Res() response) {
        try {
            const student = await this.adminsService.getStudentById(student_id);
            return response.status(200).send({
                student,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    @Put('/students/:id')
    async updateStudent(@Param('id', StudentIdPipe) student_id: number, @Res() response, @Body() updateStudentDto: UpdateStudentDto) {
        try {
            const student = await this.adminsService.updateStudent(updateStudentDto, student_id);
            return response.status(200).send({
                message: `Student ${student.name} has been updated successfully`,
                student,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }

    @Post('/students')
    async createStudent(@Res() response, @Body() createStudentDto: CreateStudentDto) {
        try {
            const student = await this.adminsService.createStudent(createStudentDto);
            return response.status(201).send({
                message: `Student ${student.name} has been created successfully`,
                student,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    @Delete('/students/:id')
    async deleteStudent(@Param('id', StudentIdPipe) student_id: number, @Res() response) {
        try {
            await this.adminsService.deleteStudent(student_id);
            return response.status(200).send({
                message: `Student ${student_id} has been deleted successfully`,
              });
        } catch(err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
}
