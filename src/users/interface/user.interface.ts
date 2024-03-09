import { Document } from 'mongoose';
import { UserRole } from 'src/auth/user-roles';

export interface IUser extends Document {
    readonly name: string;
    password: string;
    email: string;
    verified: boolean;
    code: string ;
    expiresAt: Date;
    events: string[];
    readonly role : UserRole ;
}

export interface IUserResponse {
    readonly _id: string;
    readonly name: string;
    readonly email: string;
}
