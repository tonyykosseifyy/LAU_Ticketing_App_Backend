import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
export class Student extends Document {
  @Prop({ required: true, unique: true, type: Number, min: 199000000, max: 999999999 })
  student_id: number;

  @Prop({ required: true, minlength: 3, maxlength: 80 })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Event' }], default: []})
  attendedEvents: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
