import { getOrSetCache } from "../../utils/cache.util";
import { NextFunction, Request, Response } from "express";
import {
  AuthorDetails,
  MovieDetailsProps,
  MovieReviewProps,
} from "./movie.interface";
import userModel from "../user/user.model";
import _, { concat } from "lodash";
import { faker } from "@faker-js/faker";
import { lowercaseFirstLetter, toCamel } from "../../utils/index.util";
import reviewModel from "../reviews/review.model";

const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
  },
};

export default class MovieService {
  getMovies = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page;
    const CACHE_KEY = `movies:${JSON.stringify(req.query)}`;

    console.log(CACHE_KEY);

    const templateStr = `https://api.themoviedb.org/3/discover/movie?include_video=false&language=en-US?page=${page}&primary_release_date.gte=${req.query["primary_release_date.gte"]}&primary_release_date.lte=${req.query["primary_release_date.lte"]}&with_genres=${req.query["with_genres"]}&sort_by=${req.query["sort_by"]}`;

    console.table(req.query);
    console.log(templateStr);

    try {
      // console.log("Extract endpoint = ", extractEndpoint);
      const cached = await getOrSetCache(CACHE_KEY, async () => {
        console.log("URL = ", templateStr);
        const response = await fetch(templateStr, OPTIONS);

        console.log("Response = ", response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        console.log("The Json extracting = ", json);
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

  getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    // 872585
    const id = req.params.id;

    console.log(id);
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const OPTIONS = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
      },
    };
    const CACHE_MOVIE_DETAIL_KEY = `movie<${id}>`;
    try {
      const cached = await getOrSetCache(CACHE_MOVIE_DETAIL_KEY, async () => {
        const response = await fetch(url, OPTIONS);

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
      res.status(200).json({
        success: true,
        error: "Internal Server Error",
      });
    }
  };

  getReviewsByMovieId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { movieId } = req.params;
    const CACHE_KEY = `film_${movieId}_reviews`;

    const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews`;
    const newUsers = [];

    try {
      const cached: any = await getOrSetCache(CACHE_KEY, async () => {
        const response = await fetch(url, OPTIONS);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        return json;
      });

      console.log("Movie ID = ", req.params.movieId);

      const reviewsFromMyServer = await reviewModel
        .find({
          movie: req.params.movieId,
        })
        .sort({ createdAt: 1 });

      console.log("Reviews from my system: ", reviewsFromMyServer);

      const onCompleteCached = cached.results.map((item: any) => {
        const camelCaseItem = _.mapKeys(item, (value, key) => {
          if (key === "created_at" || key === "updated_at") {
            return _.camelCase(key);
          }
          return key;
        });

        return camelCaseItem;
      });

      for (const data of reviewsFromMyServer) {
        // console.log("Super data");
        onCompleteCached.unshift(data);
      }

      const userDetails = cached.results as MovieReviewProps[];

      for (const user of userDetails) {
        const userExist = await userModel.findOne({
          username: _.lowerCase(user.author_details.username),
        });
        if (userExist === null) {
          const newUser = {
            username: user.author_details.username,
            email: lowercaseFirstLetter(faker.internet.email()),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: "123456",
            gender: faker.helpers.arrayElement(["m", "f", "o"]),
            role: "user",
          };
          newUsers.push(newUser);
        }
      }

      try {
        const createdUser = await userModel.insertMany(newUsers);
        console.log("User created:", createdUser);
      } catch (error) {
        console.error("Error creating user:", error);
        // Handle the error appropriately
      }

      res.status(200).json({
        success: true,
        data: onCompleteCached,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };

  getCastsByMovieId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const id = req.params.movieId;
    const CACHE_CASTS_KEY = `movie<${id}>-casts`;
    const ENDPOINT = `https://api.themoviedb.org/3/movie/${id}/credits`;
    try {
      const cached = await getOrSetCache(CACHE_CASTS_KEY, async () => {
        const response = await fetch(ENDPOINT, OPTIONS);

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
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };
}
