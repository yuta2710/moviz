import { getOrSetCache, redis } from "../../utils/cache.util";
import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";

export default class ArticleService {
  private NY_TIMES_ARTICLES_URL: string =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22";

  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.params.page;
    const CACHE_KEY = `articles?page=${page}`;

    try {
      const cached = await getOrSetCache(CACHE_KEY, async () => {
        const response = await fetch(
          `${this.NY_TIMES_ARTICLES_URL}&sort=newest&page=${Number(
            page
          )}&api-key=${process.env.NEW_YORK_TIMES_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        return json;
      });

      res.status(200).json({
        success: true,
        data: cached,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };
}
