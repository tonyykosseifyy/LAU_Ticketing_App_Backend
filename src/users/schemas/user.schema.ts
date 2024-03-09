import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 80 })
  name: string;

  @Prop({ required: true, minlength: 8, maxlength: 200 })
  password: string;

  @Prop({ required: true, unique: true, minlength: 9, maxlength: 200 })
  email: string;

  @Prop()
  code: string;

  @Prop()
  expiresAt: Date;

  @Prop({ default: false }) 
  verified: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Event' }], default: [] })
  events: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
