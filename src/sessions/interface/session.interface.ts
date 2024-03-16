
import { Document } from 'mongoose';
import { UserRole } from 'src/auth/user-roles';


export interface ISession extends Document {
    readonly _id: string;
    readonly expires: Date;
    user_id: string ; 
}
