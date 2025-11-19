import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import util from "util";

import sendEmail from "../config/email";
import { getGooglePayload } from "../config/google";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/express";

export const register = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    const token = user.getSignedJwtToken();

    user.hideSecureData();

    res.status(201).json({
      success: true,
      data: user,
      token,
      message: "User created successfully",
    });
  }
);

export const loginUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new CustomError("Please provide email and password", 400);
      return next(error);
    }
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new CustomError("Invalid credentials", 401);
      return next(error);
    }

    const token = user.getSignedJwtToken();

    user.hideSecureData();

    res.status(200).json({
      success: true,
      token,
      data: user,
      message: "User logged in successfully",
    });
  }
);

export const forgotPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      const error = new CustomError("Please provide email", 400);
      return next(error);
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new CustomError("User not found", 404);
      return next(error);
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_DEV
        : process.env.FRONTEND_LOCAL;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset link",
        message: `Click the link to reset your password: ${baseUrl}/reset-password/${resetToken}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      const customError = new CustomError("Email could not be sent", 500);
      return next(customError);
    }
    res.status(200).json({
      success: true,
      message: "Reset password token sent to email",
    });
  }
);

export const resetPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordToken = req.params.resetToken;
    const { password } = req.body;
    if (!resetPasswordToken || !password) {
      const error = new CustomError(
        "Please provide reset token and password",
        400
      );
      return next(error);
    }
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      const error = new CustomError("Invalid reset token", 400);
      return next(error);
    }
    user.password = password;
    user.passwordChangedAt = new Date();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  }
);

export const verifyToken = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const error = new CustomError(
        "Please provide token",
        401,
        "token",
        "Please provide token"
      );
      return next(error);
    }
    const decoded = await (
      util.promisify<string, string>(jwt.verify) as unknown as (
        token: string,
        secret: string
      ) => Promise<JwtPayload>
    )(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new CustomError(
        "Invalid user token",
        404,
        "token",
        "Invalid user token"
      );
      return next(error);
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      const error = new CustomError(
        "User recently changed password",
        401,
        "token",
        "User recently changed password, please try with new login token"
      );
      return next(error);
    }
    req.user = user;
    next();
  }
);

export const authorization =
  (roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role)) {
      const error = new CustomError("Not authorized to access this route", 401);
      return next(error);
    }
    next();
  };

export const googleRegister = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.body;
    if (!accessToken) {
      const error = new CustomError("Please provide google access token", 400);
      return next(error);
    }

    const googlePayload = await getGooglePayload(accessToken);
    if (!googlePayload) {
      const error = new CustomError("Invalid google access token", 400);
      return next(error);
    }

    const { sub: googleId, email, name } = googlePayload;

    const user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      const error = new CustomError(
        "User already exists with this google account",
        400
      );
      return next(error);
    }

    const password = crypto.randomBytes(10).toString("hex");

    const newUser = await User.create({ email, googleId, name, password });
    const token = newUser.getSignedJwtToken();
    newUser.hideSecureData();

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Welcome to Ecommerce",
        message: `Your password is: ${password}`,
      });
    } catch (error) {
      const customError = new CustomError("Email could not be sent", 500);
      return next(customError);
    }

    res.status(201).json({
      success: true,
      token,
      data: newUser,
      message: "User created successfully",
    });
  }
);

export const googleLogin = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.body;
    if (!accessToken) {
      const error = new CustomError("Please provide google access token", 400);
      return next(error);
    }

    const googlePayload = await getGooglePayload(accessToken);
    if (!googlePayload) {
      const error = new CustomError("Invalid google access token", 400);
      return next(error);
    }

    const { sub: googleId, email } = googlePayload;

    const user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      const error = new CustomError(
        "User not found with this google account",
        404
      );
      return next(error);
    }

    const token = user.getSignedJwtToken();
    user.hideSecureData();

    res.status(200).json({
      success: true,
      token,
      data: user,
      message: "User logged in successfully",
    });
  }
);
