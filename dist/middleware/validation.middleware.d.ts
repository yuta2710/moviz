import { RequestHandler } from "express";
import { Schema } from "joi";
export declare const validationMiddleware: (schema: Schema) => RequestHandler;
