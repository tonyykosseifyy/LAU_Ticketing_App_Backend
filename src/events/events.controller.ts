import { Body, Controller, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Get, Req, Res, Post } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/request.interface';
import { CreateEventDto, ScanEventDto } from './dto/index.dto';
import { IsValidMongoIdPipe } from './validation/event-id-pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getClubEvents(@Req() request: AuthenticatedRequest, @Res() response) {
    const { club } = request.user;
    try {
      const events = await this.eventsService.getClubEvents(club._id);
      return response.status(200).send({
        events,
      });
    } catch (err) {
      return response.status(err.status).json({
        status: err.status,
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
    const { club } = request.user;
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
  @Post(':id/scan')
  async scanEvent(
    @Body() scanEventDto: ScanEventDto,
    @Res() response,
    @Param('id', IsValidMongoIdPipe) eventId: string,
  ) {
    try {
      await this.eventsService.scanEvent(scanEventDto, eventId);

      return response.status(201).json({
        message: 'User has been registered successfully',
      });
    } catch (err) {
      return response.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    }
  }

  @Get(':id/scan')
  async getEventAttendees(
    @Param('id', IsValidMongoIdPipe) eventId: string,
    @Res() response,
  ) {
    try {
      const attendees = await this.eventsService.getEventAttendees(eventId);
      return response.status(200).json({
        attendees,
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
