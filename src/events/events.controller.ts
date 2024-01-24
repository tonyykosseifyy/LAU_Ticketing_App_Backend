import { Body, Controller, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Get, Req, Res, Post, Delete, Put } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/request.interface';
import { CreateEventDto, UpdateEventDto } from './dto/index.dto';
import { IsValidMongoIdPipe } from 'src/scans/validations/event-id-pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getClubEvents(@Req() request: AuthenticatedRequest, @Res() response) {
    const club = request.user;
    try {
      const events = await this.eventsService.getClubEvents(club._id);
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

  @Get('active')
  async getActiveClubEvents(@Req() request: AuthenticatedRequest) {
    const club = request.user;
    try {
      const events = await this.eventsService.getActiveClubEvents(club._id);
      return events;
    } catch (err) {
      return err;
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
  @Delete(':id')
  async deleteEvent(
    @Param('id', IsValidMongoIdPipe) eventId: string,
    @Res() response,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const club = request.user;

      const event = await this.eventsService.deleteEvent(eventId, club);
      return response.status(200).json({
        message: 'Event has been deleted successfully',
        event,
      });
    } catch (err) {
      return response.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    }
  }
  
  @Put(':id')
  async updateEvent(
    @Param('id', IsValidMongoIdPipe) eventId: string,
    @Res() response,
    @Req() request: AuthenticatedRequest,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      const club = request.user ;
      const event = await this.eventsService.updateEvent(eventId, club, updateEventDto);
      return response.status(200).json({
        message: 'Event has been updated successfully',
        event,
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
