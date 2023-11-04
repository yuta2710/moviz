import { ErrorType } from "../utils/error-types-setting.util";
import Token from "../core/jwt/jwt.interface";
import { verifyToken } from "../core/jwt/jwt.service";
import userModel from "../modules/user/user.model";
import ErrorResponse from "../utils/error-response.util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization ||
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split("Bearer ")[1].trim();
  } else {
    token = req.cookies.refreshToken;
  }

  if (!token) {
    next(
      new ErrorResponse(
        401,
        ErrorType["UNAUTHORIZED"],
        "Unauthorized to access this routedeedededed"
      )
    );
    return;
  }

  // console.log("REFRESH TOKEN = ", token);

  try {
    const payload: Token | jwt.JsonWebTokenError = await verifyToken(token);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(
        new ErrorResponse(
          400,
          ErrorType["BAD_REQUEST"],
          "Something went wrong in payload format"
        )
      );
    }

    // console.log(payload);

    const user = await userModel.findById(payload.id).select("-password");
    // console.log(user);

    if (!user) {
      return next(
        new ErrorResponse(404, ErrorType["NOT_FOUND"], "User not found")
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        401,
        ErrorType["UNAUTHORIZED"],
        "Unauthorized to access this route"
      )
    );
  }
};

export const authorize = (
  ...roles: string[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          401,
          ErrorType["UNAUTHORIZED"],
          `User <${req.user.id}> along with role ${roles} not authorized to access this route`
        )
      );
    }
    next();
  };
};
