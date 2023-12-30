import { Body, Controller, Post, Get, Res, Delete, Param } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';

@Controller('clubs')
export class ClubsController {
    constructor(private readonly clubsService: ClubsService) {}

    @Get()
    async getClubs(@Res() response) {
        try {
            const clubs = await this.clubsService.getClubs();
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
    async create(@Res() response, @Body() createClubDto: CreateClubDto) {
        try {
            const newClub = await this.clubsService.create(createClubDto);
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
            const club = await this.clubsService.delete(id);
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
