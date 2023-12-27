import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
    @Prop({ required: true, unique: true, minlength: 3, maxlength: 200 })
    name: string ;

    @Prop({ required: true, minlength: 3, maxlength: 5000 })
    description: string;

    @Prop({ enum: ['barcode', 'qrcode'], default: 'barcode' })
    scan_type: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);