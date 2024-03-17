import { ScansService } from './scans.service';
import { ScanEventDto } from './dto/scan-event.dto';
import { AuthenticatedRequest } from 'src/interface/request.interface';
export declare class ScansController {
    private readonly scansService;
    constructor(scansService: ScansService);
    scanEvent(scanEventDto: ScanEventDto, response: any, eventId: string, request: AuthenticatedRequest): Promise<any>;
    getEventAttendees(eventId: string, response: any, request: AuthenticatedRequest): Promise<any>;
}
