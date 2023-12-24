import BaseController from "@/utils/base-controller.util";
import { NextFunction, Request, Response, Router } from "express";
import UserService from "./user.service";
import ErrorResponse from "../../utils/error-response.util";
import { ErrorType } from "../../utils/error-types-setting.util";
import { authorize, protect } from "../../middleware/authentication.middleware";

export default class UserController implements BaseController {
  path: string = "/users";
  router: Router = Router();
  private service: UserService = new UserService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router
      .route(`${this.path}`)
      .get(protect, authorize("admin"), this.getUsers)
      .post(protect, authorize("admin"), this.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(protect, authorize("admin"), this.getUserById)
      .put(protect, this.updateUser)
      .delete(protect, authorize("admin"), this.deleteUser);

    this.router
      .route(`${this.path}/:id/update-profile`)
      .patch(protect, this.updateUserProfile);

    this.router
      .route(`${this.path}/:movieId/watchlists`)
      .patch(protect, this.addMovieToUserWatchList);

    // this.router
    //   .route(`${this.path}/:id/reviews`)
    //   .get(protect, this.refreshCurrentUserReviewsFromLetterboxdServer);

    this.router.route(`${this.path}/:id/photo`).patch(protect, this.setAvatar);
  };

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
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

  private updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return await this.service.updateUserProfile(req, res, next);
  };

  private deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    await this.service.deleteUser(req, res, next);
  };

  private setAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return this.service.setAvatar(req, res, next);
  };

  private addMovieToUserWatchList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return this.service.addMovieToUserWatchList(req, res, next);
  };

  // private refreshCurrentUserReviewsFromLetterboxdServer = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   return this.service.refreshCurrentUserReviewsFromLetterboxdServer(
  //     req,
  //     res,
  //     next
  //   );
  // };
}
