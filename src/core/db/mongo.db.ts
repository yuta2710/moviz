import mongoose from "mongoose";
import colors from "colors";

export const connectMongoDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    // console.log(MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log(colors.green.bold("Database connected successfully"));
  } catch (error) {
    throw new Error(`Failed to connected MongoDB`);
  }
};
