import { Request, Response, NextFunction } from "express";
import { convertToCamelCase } from "../utils/helper";

export const asyncErrorHandler =
  (
    asyncFunction: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    asyncFunction(req, res, next).catch(next);

export const globeErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const errors: Record<string, string> = {};

  if (err.errors) {
    Object.values(err.errors).forEach((e: any) => {
      const path = e.properties.path;
      const message = e.properties.message;
      errors[path] = message;
    });
    err.status = 400;
  }

  if (err.code === 11000) {
    Object.keys(err.keyValue).forEach(
      (key) => (errors[key] = `${convertToCamelCase(key)} already exists`)
    );
    err.status = 400;
  }

  if (err.name === "JsonWebTokenError") {
    err.status = 401;
    errors.token = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    err.status = 401;
    errors.token = "Token expired";
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
    errors,
  });
};

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.message = message;
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}
