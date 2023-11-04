import { NextFunction, Request, Response } from "express";
import userModel from "../user/user.model";
import {
  createTokens,
  extractUser,
  refreshTokenReuseDetection,
  updateNewRefreshToken,
} from "../../core/jwt/jwt.service";
import { JwtPayload } from "jsonwebtoken";

export default class RefreshTokenService {
  public handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const cookies = req.cookies;
    const refreshToken = cookies.refreshToken;
    const decodedUser = extractUser(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const isHacked = await refreshTokenReuseDetection(
      decodedUser as JwtPayload,
      refreshToken,
      res,
      next
    );

    console.log("Is hacked ? ", isHacked);

    if (isHacked) {
      console.log("This user is hacked");
      return;
    }

    const newDuoTokens = await createTokens(decodedUser as JwtPayload);

    if ("accessToken" in newDuoTokens && "refreshToken" in newDuoTokens) {
      if (typeof decodedUser === "object" && decodedUser !== null) {
        const updatedRefreshToken = await updateNewRefreshToken(
          decodedUser.id,
          refreshToken,
          newDuoTokens.refreshToken
        );

        if (updatedRefreshToken) {
          console.log(
            "updatedRefreshToken ====> replaceRefreshTokenUser ===>  ",
            updatedRefreshToken
          );

          res.cookie("refreshToken", newDuoTokens.refreshToken, {
            maxAge: Number(process.env.JWT_COOKIE_EXPIRE) * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "strict",
          });
          res.status(200).json({
            accessToken: newDuoTokens.accessToken,
          });
        }
      }
    }
  };
}
