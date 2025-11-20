import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

import sendEmail from "../config/email";
import { deleteObjectInS3, putObjectInS3 } from "../config/s3";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/express";
import { getFileKeyName } from "../utils/helper";

export const getAllUsers = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || "created_at"; // default sort field
    const order = (req.query.order as string) === "asc" ? 1 : -1; // asc or desc
    const search = (req.query.search as string) || "";

    const filter: any = { _id: { $ne: req.user?.id } };
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // case-insensitive
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(filter);

    let users;

    do {
      page -= 1;
      const skip = page * limit;
      users = await User.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
    } while (users.length === 0 && page > 0);

    page += 1;

    users = await Promise.all(
      users.map(async (user) => {
        await user.getProfileUrl();
        return user;
      })
    );

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
    req.body.profileUrl = undefined;

    if (req.file) {
      const { mimetype, buffer } = req.file;
      const key = getFileKeyName(req.body.email, mimetype);

      await putObjectInS3(key, buffer, mimetype);

      req.body.profileKey = key;
    }

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
    req.body.profileUrl = undefined;

    if (req.file) {
      const { mimetype, buffer } = req.file;
      const key = getFileKeyName(req.body.email, mimetype);

      await putObjectInS3(key, buffer, mimetype);

      if (req.body.profileKey) {
        await deleteObjectInS3(req.body.profileKey);
      }

      req.body.profileKey = key;
    }

    if (req.body.isImageDeleted === "true") {
      if (req.body.profileKey) {
        await deleteObjectInS3(req.body.profileKey);
      }

      req.body.profileKey = "";
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
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

    await user.deleteProfileUrl();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);
