import { SchemaDefault } from '../../../_utils/necessary/schema.default';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose from 'mongoose';

@SchemaDefault()
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String })
  role: string;

  @Prop({ type: String })
  token?: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Number, default: 0 })
  delete: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
