import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

export const advancedResponse =
  <T extends Document>(populate: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let query;
    const reqQuery = { ...req.query };

    console.log("Req query from middleware = ", req.query);

    next();
  };
