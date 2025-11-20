import { NextFunction, Response } from "express";

import { putObjectInS3 } from "../config/s3";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/express";
import { USER_UPDATE_FIELDS } from "../utils/constant";
import { getFileKeyName } from "../utils/helper";

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

export const getUserDetails = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    user.hideSecureData();

    await user.getProfileUrl();

    res.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  }
);

export const updateUserDetails = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let updateData: { [key: string]: string } = {};

    if (req.file) {
      const { mimetype, buffer } = req.file;
      const key = getFileKeyName(req.user?.email as string, mimetype);

      await putObjectInS3(key, buffer, mimetype);

      updateData = {
        profileKey: key,
      };
      req.user?.deleteProfileUrl();
    }
    if (req.body.isImageDeleted === "true") {
      updateData = {
        profileKey: "",
      };
      req.user?.deleteProfileUrl();
    }
    for (const key in req.body) {
      if (USER_UPDATE_FIELDS.includes(key)) {
        updateData[key] = req.body[key];
      }
    }
    const user = await User.findByIdAndUpdate(req.user?.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    user.hideSecureData();

    await user.getProfileUrl();

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  }
);

export const deleteUserDetails = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.user?.id);
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
