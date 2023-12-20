import { User } from "@/modules/user/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import Token from "./jwt.interface";
import AuthResponse from "@/modules/auth/auth.response";
import userModel from "../../modules/user/user.model";
import { NextFunction, Response } from "express";
import ErrorResponse from "../../utils/error-response.util";
import { ErrorType } from "../../utils/error-types-setting.util";

export const createTokens = async (
  user: User | JwtPayload
): Promise<AuthResponse | Error> => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET as jwt.Secret,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
  const duoTokens: AuthResponse = { accessToken, refreshToken };

  console.log(duoTokens);

  return duoTokens;
};

export const verifyToken = async (
  accessToken: string
): Promise<Token | jwt.JsonWebTokenError> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as jwt.Secret,
      (err, payload) => {
        if (err) reject(err);
        resolve(payload as Token);
      }
    );
  });
};

export const refreshTokenReuseDetection = async (
  decodedUser: JwtPayload,
  refreshToken: string,
  res: Response,
  next: NextFunction
): Promise<Boolean> => {
  // Find refresh token in db
  const queryRefreshToken = await getUserByRefreshToken(
    decodedUser.id,
    refreshToken
  );

  if (!queryRefreshToken) {
    console.log(
      "RT is verified but is not present in the database ===> A Hacker is sending this token !!!"
    );

    await removeAllRefreshTokensFromUser(decodedUser.id);
    res.clearCookie("refreshToken");

    next(
      new ErrorResponse(
        403,
        ErrorType["UNAUTHORIZED"],
        "Refresh Token is invalid !"
      )
    );

    return true;
  }

  return false;
};

export const assignRefreshTokenToUser = async (
  userId: string,
  refreshToken: string
) => {
  const updateUser = await userModel.findByIdAndUpdate(
    userId,
    {
      $push: { refreshTokens: refreshToken },
    },
    { new: true }
  );

  return updateUser;
};

export const getUserByRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  const user = await userModel.findOne({
    _id: userId,
    refreshTokens: { $in: [refreshToken] },
  });

  // console.log(user);

  return user;
};

export const removeAllRefreshTokensFromUser = async (userId: string) => {
  const updatedUser = await userModel.updateOne(
    { userId },
    { refreshTokens: [] }
  );

  return updatedUser;
};

export const removeRefreshTokenFromUser = async (
  userId: string,
  refreshToken: string
) => {
  const updatedUser = await userModel.updateOne(
    { userId },
    { refreshTokens: { $pull: refreshToken } }
  );

  return updatedUser;
};

export const extractUser = (
  token: string,
  secret: string
): string | JwtPayload => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

export const updateNewRefreshToken = async (
  userId: string,
  oldRefreshToken: string,
  newRefreshToken: string
) => {
  const updatedUser = await userModel.updateOne(
    { _id: userId, refreshTokens: oldRefreshToken },
    {
      $set: {
        "refreshTokens.$": newRefreshToken,
      },
    }
  );

  return updatedUser;
};
