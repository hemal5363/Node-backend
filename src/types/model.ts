import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  unit_price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

export interface IUSerMethods {
  comparePassword(password: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
  changedPasswordAfter(JWTTimestamp: number | undefined): boolean;
}
