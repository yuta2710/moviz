import BaseController from "@/utils/base-controller.util";
import { NextFunction, Request, Response, Router } from "express";
import UserService from "./user.service";
import ErrorResponse from "../../utils/error-response.util";
import { ErrorType } from "../../utils/error-types-setting.util";

export default class UserController implements BaseController {
  path: string = "/users";
  router: Router = Router();
  private service: UserService = new UserService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.route(`${this.path}`).get(this.getUsers).post(this.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(this.getUserById)
      .put(this.updateUser)
      .delete(this.deleteUser);
  };

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { firstName, lastName, email, password, role, gender } = req.body;

      const duoTokens = await this.service.createUser(req, res, next);

      res.status(200).json({
        success: true,
        data: duoTokens,
      });
    } catch (error) {
      return next(
        new ErrorResponse(
          400,
          ErrorType["BAD_REQUEST"],
          "Unable to create this user"
        )
      );
    }
  };

  private getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return await this.service.getUsers(req, res, next);
  };

  private getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return await this.service.getUserById(req, res, next);
  };

  private updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return await this.service.updateUser(req, res, next);
  };

  private deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    await this.service.deleteUser(req, res, next);
  };
}
