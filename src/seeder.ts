import mongoose from "mongoose";
import userModel from "./modules/user/user.model";
import "dotenv/config";

const { MONGO_URI } = process.env;
try {
  mongoose.connect(MONGO_URI);
  console.log("Database connected successfully");
} catch (error) {
  throw new Error(`Failed to connected MongoDB`);
}

const mockUsers = [
  {
    username: "admin_test",
    firstName: "Admin",
    lastName: "Test",
    email: "admin.test@example.com",
    password: "123456",
    gender: "m",
    role: "admin",
  },
  {
    username: "jane_smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "123456",
    gender: "f",
    role: "user",
  },
  {
    username: "sam_jackson",
    firstName: "Sam",
    lastName: "Jackson",
    email: "sam.jackson@example.com",
    password: "123456",
    gender: "o",
    role: "user",
  },
  {
    username: "alice_wonderland",
    firstName: "Alice",
    lastName: "Wonderland",
    email: "alice.wonderland@example.com",
    password: "123456",
    gender: "f",
    role: "manager",
  },
];

export const importData = async () => {
  try {
    await userModel.insertMany(mockUsers);
  } catch (error) {
    console.log(error);
  }
};

importData();
