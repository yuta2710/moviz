import BaseController from "@/utils/base-controller.util";
import { NextFunction, Request, Response, Router } from "express";
import RefreshTokenService from "./refresh-token.service";
import { protect } from "../../middleware/authentication.middleware";

export default class RefreshTokenController implements BaseController {
  path = "/auth";
  router = Router();
  private refreshTokenService = new RefreshTokenService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route("/refresh-token").get(protect, this.handleRefreshToken);
  }

  private handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.refreshTokenService.handleRefreshToken(req, res, next);
  };
}
