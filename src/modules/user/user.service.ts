import { NextFunction, Request, Response } from "express";
import { createTokens } from "../../core/jwt/jwt.service";
import User from "./user.interface";
import userModel from "./user.model";
import UserRegisterRequest from "./user.request";
import ErrorResponse from "../../utils/error-response.util";
import { ErrorType } from "../../utils/error-types-setting.util";

export default class UserService {
  private model = userModel;

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ accessToken: string; refreshToken: string } | Error> => {
    try {
      const { firstName, lastName, email, password, role, gender } =
        req.body as UserRegisterRequest;
      const user = await this.model.create({
        firstName,
        lastName,
        email,
        password,
        role,
        gender,
      });

      return createTokens(user);
    } catch (error) {}
  };
  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.model.find().lean();
      return users.length === 0
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: users,
          });
    } catch (error) {
      return next(
        new ErrorResponse(
          500,
          ErrorType["INTERNAL_SERVER_ERROR"],
          "Unable to get all users"
        )
      );
    }
  };
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.model.findById(req.params.id).exec();

      return user === null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: user,
          });
    } catch (error) {
      throw new Error(`Unable to get this user <${req.params.id}>`);
    }
  };
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body as Partial<UserRegisterRequest>,
        { new: true }
      );
      return updatedUser === null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: updatedUser,
          });
    } catch (error) {
      return next(
        new ErrorResponse(
          400,
          ErrorType["BAD_REQUEST"],
          `Unable to update this user <${req.params.id}>`
        )
      );
    }
  };
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.model.findByIdAndDelete(req.params.id);

      return user !== null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: {},
          });
    } catch (error) {
      throw new Error(`Unable to delete this user <${req.params.id}>`);
    }
  };
}
