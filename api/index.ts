import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import app from "../src/app";

// Wrap Express app for Vercel serverless
const handler = serverless(app);

export default (req: VercelRequest, res: VercelResponse) => handler(req, res);
