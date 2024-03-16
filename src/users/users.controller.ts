import { Body, Controller, Post, Get, Res, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(@Res() response) {
        try {
            const clubs = await this.usersService.getAllUsers();
            return response.status(200).json({
                clubs
            });
        } catch(err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message
            });
        }
    }
    
}
