import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";
import User from "../models/User";

export const getAllUsers = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      data: users,
      message: "All users fetched successfully",
    });
  }
);

export const createUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  }
);

export const updateUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  }
);

export const deleteUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);
