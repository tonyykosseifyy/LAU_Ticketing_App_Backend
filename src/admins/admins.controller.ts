import { Get, Req, Res, Post, Delete, Put, Controller } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/user-roles';
import { UseInterceptors } from '@nestjs/common';
import { RolesInterceptor } from './interceptor';

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



}
