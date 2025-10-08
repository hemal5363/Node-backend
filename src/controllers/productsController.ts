import { NextFunction, Request, Response } from "express";
import Product from "../models/Product";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";

export const getAllProducts = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
      message: "All products fetched successfully",
    });
  }
);

export const createProduct = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  }
);

export const updateProduct = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      const error = new CustomError("Product not found", 404);
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  }
);

export const deleteProduct = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const error = new CustomError("Product not found", 404);
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);
