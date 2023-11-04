import { ErrorType } from "../utils/error-types-setting.util";
import ErrorResponse from "../utils/error-response.util";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Schema } from "joi";

export const validationMiddleware = (schema: Schema): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const values = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true,
      });
      req.body = values;
      next();
    } catch (error) {
      return next(
        new ErrorResponse(
          404,
          ErrorType["INTERNAL_SERVER_ERROR"],
          "Unable to validate this middleware"
        )
      );
    }
  };
};

// session device token (fingerPrint)
// refresh token rotation
