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

export interface IScanAttendees extends Document {
    attendees: [
        _id: Types.ObjectId,
        event: Types.ObjectId,
        student: {
            _id: Types.ObjectId;
            student_id: number;
            name: string;
        },
        date: Date
    ]
}


