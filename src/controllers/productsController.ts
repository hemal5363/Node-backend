import { NextFunction, Request, Response } from "express";
import Product from "../models/Product";
import { asyncErrorHandler, CustomError } from "../middlewares/errorMiddleware";

export const getAllProducts = asyncErrorHandler(
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
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const totalProducts = await Product.countDocuments(filter);

    let products = [];

    do {
      page -= 1;
      const skip = page * limit;
      products = await Product.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
    } while (products.length === 0 && page > 0);

    page += 1;

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total: totalProducts,
          page,
          limit,
          totalPages: Math.ceil(totalProducts / limit),
          hasNextPage: page * limit < totalProducts,
          hasPrevPage: page > 1,
          sortBy,
          order: order === 1 ? "asc" : "desc",
        },
      },
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
