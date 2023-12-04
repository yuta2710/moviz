import BaseController from "../../utils/base-controller.util";
import { NextFunction, Request, Response, Router } from "express";
import ArticleService from "./article.service";

export default class ArticleController implements BaseController {
  path: string = "/articles";
  router: Router = Router();
  private service: ArticleService = new ArticleService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.route(`${this.path}/:page`).get(this.getArticles);
  };

  private getArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.service.getArticles(req, res, next);
  };
}
