import { Document } from "mongoose";
import { Movie } from "../movies/movie.interface";
// import { ReviewCustomization } from "../reviews/review.interface";

export interface User extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  role: string;
  watchLists?: string[];
  password: string;
  isValidPassword?(currentPassword: string): Promise<Boolean | Error>;
  resetPasswordToken?: string;
  resetPasswordExpired?: string;
  refreshTokens?: [string];
  // reviews?: ReviewCustomization[];
  getResetPasswordToken?(): void;
}
