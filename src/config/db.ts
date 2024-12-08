import mongoose from "mongoose";
import { MONGODB_URI } from "@constants/env";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "\x1b[32m%s\x1b[0m",
      `MongoDB connected successfully [${MONGODB_URI}]`
    );
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", `MongoDB connection error ${error}`);
    process.exit(1);
  }
};

export { connectDB };
