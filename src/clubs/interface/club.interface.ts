import { Document } from 'mongoose';


export interface IClub extends Document {
    readonly name: string;
    readonly password: string;
    readonly email: string;
    readonly verified: boolean;
    code: string ;
    expiresAt: Date;
    readonly events: string[];
}
