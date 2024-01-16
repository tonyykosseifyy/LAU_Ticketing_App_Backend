import { Types } from 'mongoose';

interface IScan {
    event: Types.ObjectId;
    student: Types.ObjectId;
    date: Date;
}

export default IScan;