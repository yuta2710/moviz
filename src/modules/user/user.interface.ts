import { Document } from "mongoose";
// import { ReviewCustomization } from "../reviews/review.interface";

export interface User extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  role: string;
  password: string;
  isValidPassword?(currentPassword: string): Promise<Boolean | Error>;
  resetPasswordToken?: string;
  resetPasswordExpired?: string;
  refreshTokens?: [string];
  // reviews?: ReviewCustomization[];
  getResetPasswordToken?(): void;
}
