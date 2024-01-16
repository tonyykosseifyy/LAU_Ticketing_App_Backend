import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
class Scan extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    event: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
    student: Types.ObjectId;

    @Prop({ type: Date, required: true })
    date: Date;
}


export const ScanSchema = SchemaFactory.createForClass(Scan);

// Add a unique compound index on event and student fields
ScanSchema.index({ event: 1, student: 1 }, { unique: true });