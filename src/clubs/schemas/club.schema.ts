import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Club extends Document {

  @Prop({ required: true, unique: true, minlength: 3, maxlength: 200 })
  name: string;

  @Prop({ required: true, minlength: 8, maxlength: 200 })
  password: string;

  @Prop({ minlength: 9, maxlength: 200 })
  email: string;

  @Prop({ default: true })
  first_login: boolean;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
