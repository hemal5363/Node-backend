import serverless from "serverless-http";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/db";

let isDbConnected = false;
const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
  console.log("Request received");
  // ❌ Don't use await here — it never resolves properly in Vercel
  return handler(req, res);
}
