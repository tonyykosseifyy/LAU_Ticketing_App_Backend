import { Document } from 'mongoose';


export interface IUser extends Document {
    readonly name: string;
    password: string;
    email: string;
    verified: boolean;
    code: string ;
    expiresAt: Date;
    events: string[];
}

export interface IUserResponse {
    readonly _id: string;
    readonly name: string;
    readonly email: string;
}
