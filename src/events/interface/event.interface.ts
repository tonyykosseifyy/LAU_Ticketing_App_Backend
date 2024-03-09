import { Document } from 'mongoose';

export interface IEvent extends Document {
    readonly name: string;
    readonly description: string;
    readonly scan_type: 'barcode' | 'qrcode';
    readonly start_date: Date;
    end_date: Date;
    readonly users: string[];
}

export interface IEventWithCount extends IEvent {
    readonly attendee_count: number;
}
