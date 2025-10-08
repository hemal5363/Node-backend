import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types/model";
import { formatDate } from "../utils/helper";

const ProductSchema: Schema = new Schema(
  {
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
      get: formatDate,
    },
    updated_at: {
      type: Date,
      default: Date.now,
      get: formatDate,
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

ProductSchema.pre(["find", "findOneAndUpdate"], function (next) {
  this.select("-__v");
  next();
});

ProductSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});


export default mongoose.model<IProduct>("Product", ProductSchema);
