import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
export class Scan extends Document {
    @Prop()
    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    event_id: Types.ObjectId;

    @Prop({ required: true, type: Date })
    date: Date;
}

export const ScanSchema = SchemaFactory.createForClass(Scan);