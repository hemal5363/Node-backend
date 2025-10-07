import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // Already connected

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(`✅ MongoDB Connected`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err; // important
  }
};

export default connectDB;
