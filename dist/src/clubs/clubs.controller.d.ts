import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
export declare class ClubsController {
    private readonly clubsService;
    constructor(clubsService: ClubsService);
    getClubs(response: any): Promise<any>;
    create(response: any, createClubDto: CreateClubDto): Promise<any>;
    delete(id: string, response: any): Promise<any>;
}
