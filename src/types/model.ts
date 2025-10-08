import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  unit_price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
