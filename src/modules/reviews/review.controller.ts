import { protect } from "../../middleware/authentication.middleware";
import BaseController from "../../utils/base-controller.util";
import { NextFunction, Request, Response, Router } from "express";
import ReviewService from "./review.service";

export default class ReviewController implements BaseController {
  path: string = "/reviews";
  router: Router = Router();
  private service: ReviewService = new ReviewService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router
      .route(`${this.path}/:movieId`)
      // .get(protect, authorize("admin"), this.getUsers)
      .post(protect, this.createReview);
  };

  private createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    return this.service.createReviewForMovie(req, res, next);
  };
}
