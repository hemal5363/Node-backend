import express, { Request, Response } from "express";
import cors from "cors";
import User from "./models/User";

const app = express();

app.use(cors());

app.use(express.json());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + Vercel + Local!");
});

// Test route (for /api)
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "API is working fine" });
});

// Create user
app.post("/api/users", async (req: Request, res: Response) => {
  try {
    console.log("POST /api/users");
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get users
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    console.log("GET /api/users");
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default app;
