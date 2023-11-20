import { NextFunction, Request, Response } from "express";
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
