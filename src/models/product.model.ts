import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  unit_price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    maxlength: [50, "Name can not be more than 50 characters"],
    minlength: [2, "Name can not be less than 2 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
    minlength: [2, "Description can not be less than 2 characters"],
  },
  unit_price: {
    type: Number,
    required: [true, "Please add a unit price"],
  },
  quantity: {
    type: Number,
    required: [true, "Please add a quantity"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
