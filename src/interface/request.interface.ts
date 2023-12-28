import { Request } from 'express';
import { IClub } from '../clubs/interface/club.interface';

export interface AuthenticatedRequest extends Request {
    user: {
        club: IClub
    }
}