import ErrorResponse from "../utils/error-response.util";
import { NextFunction, Request, Response } from "express";
export declare const errorResponseMiddleware: (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
