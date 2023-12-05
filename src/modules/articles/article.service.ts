import { redis } from "../../utils/cache.util";
import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";

export default class ArticleService {
  private NY_TIMES_ARTICLES_URL: string =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22";

  // private redisClient = createClient();
  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.params.page;
    const cacheKey = `articles_page_${page}`;
    const port = 6379;
    const host = "127.0.0.1";
    // client
    //   .on("error", (err) => console.log("Redis Client Error", err))
    //   .connect();

    // console.log("This is client", client);
    redis.get(
      `articles?page=${page}`,
      async (error: Error, articles: string) => {
        if (error) {
          console.error("Error retrieving data from Redis:", error);
        }

        if (articles !== null) {
          // Data found in cache, send it as a response
          return res.status(200).json({
            success: true,
            data: JSON.parse(articles),
          });
        }

        // Data not found in cache, fetch from API
        try {
          const response = await fetch(
            `${this.NY_TIMES_ARTICLES_URL}&sort=newest&page=${Number(
              page
            )}&api-key=${process.env.NEW_YORK_TIMES_API_KEY}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const jsonData = await response.json();

          // Save data to Redis cache
          redis.setex(
            `articles?page=${page}`,
            3600, // Set an expiration time in seconds (e.g., 1 hour)
            JSON.stringify(jsonData)
          );

          // Send the fetched data as a response
          res.status(200).json({
            success: true,
            data: jsonData,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).json({
            success: false,
            error: "Internal Server Error",
          });
        }
      }
    );
    // try {
    //   const response = await fetch(
    //     `${this.NY_TIMES_ARTICLES_URL}&sort=newest&page=${Number(
    //       page
    //     )}&api-key=${process.env.NEW_YORK_TIMES_API_KEY}`
    //   );
    //   const json = response.json();
    //   json.then((data) => {
    //     res.status(200).json({
    //       success: true,
    //       data,
    //     });
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };
}
