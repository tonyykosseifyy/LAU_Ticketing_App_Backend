import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
export class Session extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId | string;

  @Prop({ required: true })
  expires: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
