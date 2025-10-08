import serverless from "serverless-http";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/db";

let isDbConnected = false;
const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  console.log("Request received");

  try {
    if (!isDbConnected) {
      await connectDB();
      isDbConnected = true;
      console.log("✅ MongoDB Connected");
    }

    // 🚫 DO NOT use await here!
    return handler(req, res);
  } catch (err) {
    console.error("❌ Error in /api:", err);
    return res.status(500).json({ error: (err as Error).message });
  }
}

// import type { VercelRequest, VercelResponse } from '@vercel/node';

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   console.log('✅ /api route hit');
//   return res.status(200).json({ message: 'Vercel API works!' });
// }
