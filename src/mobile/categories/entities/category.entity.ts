import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaDefault } from '../../../_utils/necessary/schema.default';
import mongoose from 'mongoose';

@SchemaDefault()
export class Category {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Number, default: 0 })
  delete: number;
}


export const CategorySchema = SchemaFactory.createForClass(Category);