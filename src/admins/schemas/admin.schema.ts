import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 80 })
  name: string;

  @Prop({ required: true, minlength: 8, maxlength: 200 })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
