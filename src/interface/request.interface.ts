import { Request } from 'express';
import { IClub } from '../users/interface/user.interface';

export interface AuthenticatedRequest extends Request {
    user: IClub ;
}

export interface LoginRequest extends Request {
    user: {
        club: IClub
    }
}