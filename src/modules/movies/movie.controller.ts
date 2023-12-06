import BaseController from "@/utils/base-controller.util";
import MovieService from "./movie.service";
import { NextFunction, Request, Response, Router } from "express";

export default class MovieController implements BaseController {
  path: string = "/movies";
  router: Router = Router();
  private service: MovieService = new MovieService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.route(`${this.path}`).get(this.getMovies);
    this.router
      .route(`${this.path}/:movieId/reviews`)
      .get(this.getReviewsByMovieId);
  };

  private getMovies = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return this.service.getMovies(req, res, next);
  };

  private getReviewsByMovieId = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return this.service.getReviewsByMovieId(req, res, next);
  };
}
