import { Document } from 'mongoose';


export interface IAdmin extends Document {
    readonly name: string;
    readonly password: string;
}
