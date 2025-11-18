import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import { verifyToken } from "./controllers/authController";
import { globeErrorHandler } from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productsRoutes";
import meUserRoutes from "./routes/meUserRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/products", verifyToken, productRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user/me", verifyToken, meUserRoutes);
app.use("/api/v1/user", verifyToken, userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + Vercel + Local!");
});

// Error Handler
app.use(globeErrorHandler);

export default app;
