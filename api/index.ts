import serverless from "serverless-http";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/db";

let isDbConnected = false;

// Serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
  return serverless(app)(req, res);
};
