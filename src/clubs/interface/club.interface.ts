import { Document } from 'mongoose';


export interface IClub extends Document {
    readonly name: string;
    password: string;
    email: string;
    verified: boolean;
    code: string ;
    expiresAt: Date;
    events: string[];
}

export interface IClubResponse {
    readonly _id: string;
    readonly name: string;
    readonly email: string;
}
