import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

console.log("process.env.FRONTEND_URL", process.env.FRONTEND_URL);

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + Vercel + Local!");
});

export default app;
