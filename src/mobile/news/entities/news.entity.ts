import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { SchemaDefault } from "../../../_utils/necessary/schema.default";
import { Category } from "../../categories/entities/category.entity";
import { Country } from "../../country/entities/country.entity";

@SchemaDefault()
export class News {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  link: string;

  @Prop({ type: [{ type: String }] })
  creator?: string[];

  @Prop({ type: String })
  description?: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: Date })
  pubDate: Date;

  @Prop({ type: String })
  imgUrl?: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
    default: [],
  })
  categories: Category[];

  @Prop({ required: true, type: Country })
  country: Country;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Number, default: 0 })
  delete: number;
}

export const NewsSchema = SchemaFactory.createForClass(News);
