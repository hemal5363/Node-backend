import serverless from "serverless-http";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/db";

let isDbConnected = false;

// Correctly typed serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }

  // await the serverless-http wrapper
  await serverless(app)(req, res);
};
