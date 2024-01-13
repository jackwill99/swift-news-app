import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { SchemaDefault } from "../_utils/necessary/schema.default";

@SchemaDefault()
export class Country {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Number, default: 0 })
  delete: number;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
