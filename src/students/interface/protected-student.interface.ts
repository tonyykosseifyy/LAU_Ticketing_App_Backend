import { Document } from 'mongoose';

export interface IStudentProtected extends Document {
    name: string;
    readonly student_id: number;
}
