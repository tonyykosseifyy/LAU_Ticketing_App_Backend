import { Get, Req, Res, Post, Delete, Put, Controller, Body } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/user-roles';
import { UseInterceptors } from '@nestjs/common';
import { RolesInterceptor } from './interceptor';
import { UpdateEventDto } from '../events/dto/update-event.dto';

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
    async createEvent(@Res() response, @Body() createEventDto) {
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


}
