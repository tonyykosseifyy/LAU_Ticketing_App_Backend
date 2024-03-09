import { Body, Controller, Post, Get, Res, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers(@Res() response) {
        try {
            const clubs = await this.usersService.getUsers();
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

    @Post()
    async create(@Res() response, @Body() createUserDto: CreateUserDto) {
        try {
            const newUser = await this.usersService.create(createUserDto);
            return response.status(201).json({
                message: "User has been created successfully",
                newUser
            });
          } catch (err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message
            });
          }
    }

    @Delete('/:id')
    async delete(@Param('id') id: string, @Res() response) {
        try {
            const user = await this.usersService.delete(id);
            return response.status(200).json({
                message: `User ${id} has been deleted successfully`,
                user
            });
        } catch(err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message
            });
        }
    }
}
