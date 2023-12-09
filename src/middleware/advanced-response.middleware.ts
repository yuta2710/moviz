import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

const advancedResponse =
  <T extends Document>(model: Model<T>, populate: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let query;
    const reqQuery = { ...req.query };

    console.log(req.query);
  };
