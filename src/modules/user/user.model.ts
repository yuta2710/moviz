import mongoose, { model } from "mongoose";
import User from "./user.interface";
import { NextFunction } from "express";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, "Please add a username"],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Please add a password"],
      select: false,
    },
    gender: {
      type: String,
      enum: ["m", "f", "o"],
      required: [true, "Please add a gender"],
      default: "o",
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    photo: {
      type: String,
      default:
        "https://sepm-bucket.s3.eu-west-1.amazonaws.com/default_avatar.jpeg",
    },
    resetPasswordToken: String,
    resetPasswordExpired: String,
    refreshTokens: [String],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

UserSchema.pre<User>("save", async function (next: NextFunction) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.isValidPassword = async function (currentPassword: string) {
  console.log(this.password, currentPassword);
  return await bcryptjs.compare(currentPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// UserSchema.virtual("durationInHours").get(function () {
//   return this.firstName + " fefefe";
// });

export default model<User>("User", UserSchema);
