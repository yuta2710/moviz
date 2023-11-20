import { Document } from "mongoose";
export default interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    role: string;
    password: string;
    isValidPassword?(currentPassword: string): Promise<Boolean | Error>;
    resetPasswordToken?: string;
    resetPasswordExpired?: string;
    refreshTokens?: [string];
    getResetPasswordToken?(): void;
}
