import { Body, Controller, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Get, Req, Res, Post } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/request.interface';
import { CreateEventDto } from './dto/index.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getClubEvents(@Req() request: AuthenticatedRequest, @Res() response) {
    const club = request.user;
    try {
      const events = await this.eventsService.getClubEvents(club?._id);
      return response.status(200).send({
        events,
      });
    } catch (err) {
      return response.status(err?.status).json({
        status: err?.status,
        message: err.message,
      });
    }
  }

  @Post()
  async createEvent(
    @Req() request: AuthenticatedRequest,
    @Body() createEventDto: CreateEventDto,
    @Res() response,
  ) {
    const club = request.user;
    if (!createEventDto.clubs) {
      createEventDto.clubs = [];
    }
    createEventDto.clubs.push(club._id);

    try {
      const newEvent = await this.eventsService.createEvent(createEventDto);
      return response.status(201).json({
        message: 'Event has been created successfully',
        newEvent,
      });
    } catch (err) {
      return response.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    }
  }
  
  @Get('/dashboard')
  async getEventsDetails(@Res() response) {
    try {
      const events = await this.eventsService.getEventsDashboard();
      return response.status(200).json({
        events,
      });
    } catch (err) {
      return response.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    }
  }
}
