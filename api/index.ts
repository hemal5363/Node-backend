import serverless from "serverless-http";
import app from "../src/app";
import connectDB from "../src/db";

connectDB(); // Connect to MongoDB once per serverless cold start

export default serverless(app);
