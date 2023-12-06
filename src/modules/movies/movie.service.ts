import { getOrSetCache } from "../../utils/cache.util";
import { NextFunction, Request, Response } from "express";

export default class MovieService {
  getMovies = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page;
    const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
    const CACHE_KEY = `movies?page=${page}`;

    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
      },
    };

    try {
      const cached = await getOrSetCache(CACHE_KEY, async () => {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        console.log("Json = ", json);
        return json;
      });

      res.status(200).json({
        success: true,
        data: cached,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };
}
