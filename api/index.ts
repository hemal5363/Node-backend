import serverless from "serverless-http";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/db";

let serverReady: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("➡️ Request received");

  try {
    if (!serverReady) {
      await connectDB();
      serverReady = serverless(app);
      console.log("✅ MongoDB connected and server ready");
    }

    return serverReady(req as any, res as any);
  } catch (err: any) {
    console.error("❌ Handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}
