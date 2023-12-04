import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import Redis from "redis";

export default class ArticleService {
  private NY_TIMES_ARTICLES_URL: string =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22";
  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    // const redisClient = Redis.createClient();

    const page = req.params.page;
    console.table({ page, apiKey: process.env.NEW_YORK_TIMES_API_KEY });

    try {
      const response = await fetch(
        `${this.NY_TIMES_ARTICLES_URL}&sort=newest&page=${Number(
          page
        )}&api-key=${process.env.NEW_YORK_TIMES_API_KEY}`
      );
      const json = response.json();
      json.then((data) => {
        res.status(200).json({
          success: true,
          data,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
}
