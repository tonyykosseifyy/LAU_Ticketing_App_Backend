import { Controller, Post, Body, Res, Param, Get, Req } from '@nestjs/common';
import { ScansService } from './scans.service';
import { IsValidMongoIdPipe } from './validations/event-id-pipe';
import { ScanEventDto } from './dto/scan-event.dto';
import { AuthenticatedRequest } from 'src/interface/request.interface';

@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post(':id')
  async scanEvent(
    @Body() scanEventDto: ScanEventDto,
    @Res() response,
    @Param('id', IsValidMongoIdPipe) eventId: string
  ) {
    try {
      await this.scansService.scanEvent(scanEventDto, eventId);

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

  @Get(':id')
  async getEventAttendees(
    @Param('id', IsValidMongoIdPipe) eventId: string,
    @Res() response,
    @Req() request: AuthenticatedRequest
  ) {
    try {
      const club = request.user;
      const attendees = await this.scansService.getEventAttendees(eventId, club);
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
}
