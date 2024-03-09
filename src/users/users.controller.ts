import { Body, Controller, Post, Get, Res, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getClubs(@Res() response) {
        try {
            const clubs = await this.usersService.getClubs();
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
            const newClub = await this.usersService.create(createUserDto);
            return response.status(201).json({
                message: "Club has been created successfully",
                newClub
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
            const club = await this.usersService.delete(id);
            return response.status(200).json({
                message: `Club ${id} has been deleted successfully`,
                club
            });
        } catch(err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message
            });
        }
    }
}
