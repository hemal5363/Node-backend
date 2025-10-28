import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import productRoutes from "./routes/productsRoutes";
import usersRoutes from "./routes/usersRoutes";
import { globeErrorHandler } from "./middlewares/errorMiddleware";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/products", productRoutes);

app.use("/api/v1/users", usersRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + Vercel + Local!");
});

// Error Handler
app.use(globeErrorHandler);

export default app;
