import { Document } from 'mongoose';


export interface IClub extends Document {
    readonly name: string;
    password: string;
    email: string;
    verified: boolean;
    code: string ;
    expiresAt: Date;
    readonly events: string[];
}
