import mongoose from "mongoose";

// Extend global to add mongoose cache for serverless
declare global {
  // eslint-disable-next-line no-var
  var _mongo:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

const connectDB = async (): Promise<typeof mongoose> => {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    const uri = process.env.MONGO_URI!;
    cached!.promise = mongoose
      .connect(uri, {
        dbName: "test", // Replace with your DB name
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m); // explicitly return mongoose
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
};

export default connectDB;
