import { Controller } from '@nestjs/common';
import { EventsService } from './events.service';
import { Get, Req, Res } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/request.interface';


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    // @Get()
    // async getClubEvents(@Req() request: AuthenticatedRequest, @Res() response) {
    //     const { club } = request.user ;
    //     try {
    //         const events = await this.eventsService.getClubEvents(club);
    //         return response.status(200).send({
    //             events
    //         })
    //     } catch(err) {
    //         return response.status(err.status).json({
    //             status: err.status,
    //             message: err.message
    //         });
    //     }
    // }

}
