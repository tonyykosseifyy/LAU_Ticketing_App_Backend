import { Types } from 'mongoose';

export interface IScan {
    event: Types.ObjectId;
    student: Types.ObjectId;
    date: Date;
}

export interface IScanDetailed {
    event: Types.ObjectId;
    student: {
        student_id: number;
        name: string;
    };
    date: Date;
}


