import ErrorResponse from "../utils/error-response.util";
import { ErrorType } from "../utils/error-types-setting.util";
import { NextFunction, Request, Response } from "express";

export const errorResponseMiddleware = async (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const status: number = err.status || 500;
  const type: ErrorType = err.type || ErrorType.INTERNAL_SERVER_ERROR;
  const message: string = err.message || "Something went wrong";

  res.status(status).json({ status, type, message });
};
