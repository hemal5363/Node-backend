import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express + Vercel!");
});

export default app;
