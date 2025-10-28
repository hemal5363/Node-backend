import mongoose, { Schema } from "mongoose";
import { formatDate } from "../utils/helper";
import { IUser } from "../types/model";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      maxlength: [50, "Name can not be more than 50 characters"],
      minlength: [2, "Name can not be less than 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
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

UserSchema.pre(["find", "findOneAndUpdate"], function (next) {
  this.select("-__v, -password");
  next();
});

UserSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
