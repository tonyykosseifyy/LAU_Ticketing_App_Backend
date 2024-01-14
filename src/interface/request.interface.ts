import { Request } from 'express';
import { IClub } from '../clubs/interface/club.interface';

export interface AuthenticatedRequest extends Request {
    user: IClub ;
}

export interface LoginRequest extends Request {
    user: {
        club: IClub
    }
}