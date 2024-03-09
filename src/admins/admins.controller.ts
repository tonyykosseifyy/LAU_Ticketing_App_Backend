import { Get, Req, Res, Post, Delete, Put, Controller } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/user-roles';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UseInterceptors } from '@nestjs/common';
import { RolesInterceptor } from './interceptor';

@UseInterceptors(RolesInterceptor)
@Roles(UserRole.Admin) 
@Controller('dashboard')

export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Get()
    async getAllEvents() {
        const events = await this.adminsService.getAllEvents();
        return events ;
      }
}
