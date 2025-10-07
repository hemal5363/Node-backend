import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

// Vercel serverless function
export default (req: VercelRequest, res: VercelResponse) => app(req, res);
