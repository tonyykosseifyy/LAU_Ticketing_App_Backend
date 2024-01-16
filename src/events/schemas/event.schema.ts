import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';


@Schema()
export class Event extends Document {
    @Prop({ required: true, unique: true, minlength: 3, maxlength: 200 })
    name: string;

    @Prop({ required: true, minlength: 3, maxlength: 5000 })
    description: string;

    @Prop({ enum: ['barcode', 'qrcode'], default: 'barcode' })
    scan_type: string;

    @Prop({ required: true, type: Date })
    start_date: Date;

    @Prop({ required: true, type: Date })
    end_date: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Club' }], default: [] })
    clubs: Types.ObjectId[];
}


export const EventSchema = SchemaFactory.createForClass(Event);

// Adding a unique compound index
EventSchema.index({ name: 1, start_date: 1 }, { unique: true });


// Pre-save middleware
EventSchema.pre('save', function(next) {
    if (this.start_date >= this.end_date) {
        next(new Error('Start date must be before end date'));
    } else {
        next();
    }
});