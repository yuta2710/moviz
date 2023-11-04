import BaseController from "@/utils/base-controller.util";
import { NextFunction, Request, Response, Router } from "express";
import AuthService from "./auth.service";
import AuthRequest from "./auth.request";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { onCreate } from "../user/user.validation";
import { onLogin } from "./auth.validation";
import ErrorResponse from "../../utils/error-response.util";
import { protect } from "../../middleware/authentication.middleware";
import { ErrorType } from "../../utils/error-types-setting.util";

export default class AuthController implements BaseController {
  path = "/auth";
  router = Router();
  private authService: AuthService = new AuthService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router
      .route(`${this.path}/register`)
      .post(validationMiddleware(onCreate), this.register);
    this.router
      .route(`${this.path}/login`)
      .post(validationMiddleware(onLogin), this.login);
    this.router.route(`${this.path}/me`).get(protect, this.getMe);
    this.router.route(`${this.path}/forgot-password`).post(this.forgotPassword);
    this.router
      .route(`${this.path}/reset-password-token/:resetPasswordToken`)
      .put(this.resetPassword);
    this.router.route(`${this.path}/logout`).get(this.logOut);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const duoTokens = await this.authService.register(req, res, next);
    this.assignTokenForCookies(req, res, next, duoTokens);
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    const duoTokens = await this.authService.login(req, res, next);
    this.assignTokenForCookies(req, res, next, duoTokens);
  };

  private getMe = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      data: await this.authService.getMe(req, res, next),
    });
  };

  private assignTokenForCookies = async (
    req: Request,
    res: Response,
    next: NextFunction,
    duoTokens: { accessToken: string; refreshToken: string } | Error
  ) => {
    if (duoTokens === undefined || duoTokens instanceof Error) {
      next(
        new ErrorResponse(
          400,
          ErrorType["UNAUTHORIZED"],
          "Something went wrong in returning duo tokens"
        )
      );
      return;
    }
    if ("refreshToken" in duoTokens) {
      res
        .status(200)
        .cookie("refreshToken", duoTokens.refreshToken, {
          expires: new Date(
            Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 1000
          ),
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        })
        .json(duoTokens);
    }
  };

  private forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.authService.forgotPassword(req, res, next);
  };

  private resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.authService.resetPassword(req, res, next);
  };

  private logOut = async (req: Request, res: Response, next: NextFunction) => {
    return this.authService.logOut(req, res, next);
  };
}
