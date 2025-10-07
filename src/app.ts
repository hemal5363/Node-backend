import express, { Request, Response } from "express";
import cors from "cors";
import User from "./models/User";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + Vercel + Local!");
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default app;
