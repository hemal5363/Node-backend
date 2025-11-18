import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

import sendEmail from "../config/email";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/express";
import { USER_UPDATE_FIELDS } from "../utils/constant";

export const getAllUsers = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || "created_at"; // default sort field
    const order = (req.query.order as string) === "asc" ? 1 : -1; // asc or desc
    const search = (req.query.search as string) || "";

    const filter: any = {};
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // case-insensitive
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(filter);

    let users = [];

    do {
      page -= 1;
      const skip = page * limit;
      users = await User.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
    } while (users.length === 0 && page > 0);

    page += 1;

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
          hasNextPage: page * limit < totalUsers,
          hasPrevPage: page > 1,
          sortBy,
          order: order === 1 ? "asc" : "desc",
        },
      },
      message: "All users fetched successfully",
    });
  }
);

export const createUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const password = crypto.randomBytes(10).toString("hex");
    req.body.password = password;
    const user = await User.create(req.body);
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to Ecommerce",
        message: `Your password is: ${password}`,
      });
    } catch (error) {
      const customError = new CustomError("Email could not be sent", 500);
      return next(customError);
    }
    user.hideSecureData();
    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  }
);

export const updateUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let updateData: { [key: string]: string } = {};
    for (const key in req.body) {
      if (USER_UPDATE_FIELDS.includes(key)) {
        updateData[key] = req.body[key];
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    user.hideSecureData();
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

export const updateUserPassword = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { password, oldPassword } = req.body;
    const user = await User.findById(req.user?.id).select("+password");
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    if (!password || !oldPassword) {
      const error = new CustomError(
        "Please provide password and old password",
        400
      );
      return next(error);
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      const error = new CustomError("Invalid credentials", 401);
      return next(error);
    }
    user.password = req.body.password;
    user.passwordChangedAt = new Date();
    await user.save();
    res.status(200).json({
      success: true,
      message: "User password updated successfully",
    });
  }
);
