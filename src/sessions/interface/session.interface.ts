import { Document } from 'mongoose';


export interface ISession extends Document {
    readonly _id: string;
    readonly expires: Date;
    user_id: string ; 
}
