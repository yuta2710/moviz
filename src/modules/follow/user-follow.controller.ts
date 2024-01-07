import { NextFunction, Request, Response, Router } from "express";
import FollowService from "./user-follow.service";
import { protect } from "../../middleware/authentication.middleware";

export default class FollowController {
  path: string = "";
  followPath: string = "/follow";
  unFollowPath: string = "/unfollow";
  router: Router = Router();
  private followService = new FollowService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.route(`${this.followPath}/:id`).post(protect, this.onFollow);
    this.router.route(`${this.unFollowPath}/:id`).post(protect, this.unFollow);
  };

  private onFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return this.followService.onFollow(req, res, next);
  };

  private unFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return this.followService.unFollow(req, res, next);
  };
}
