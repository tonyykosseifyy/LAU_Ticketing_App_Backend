import { Document } from 'mongoose';

export interface IEvent extends Document {
    readonly name: string;
    readonly description: string;
    readonly scan_type: 'barcode' | 'qrcode';
    readonly start_date: Date;
    readonly end_date: Date;
    readonly clubs: string[];
}
