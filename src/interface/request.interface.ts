import { Request } from 'express';
import { IUser } from '../users/interface/user.interface';

export interface AuthenticatedRequest extends Request {
    user: IUser ;
}

export interface LoginRequest extends Request {
    user: {
        user: IUser
    }
}