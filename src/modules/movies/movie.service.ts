import { getOrSetCache } from "../../utils/cache.util";
import { NextFunction, Request, Response } from "express";
import {
  AuthorDetails,
  MovieDetailsProps,
  MovieReviewProps,
} from "./movie.interface";
import userModel from "../user/user.model";
import _, { concat, toLower } from "lodash";
import { faker } from "@faker-js/faker";
import {
  getRandomPhotoUrl,
  lowerAll,
  lowercaseFirstLetter,
  toCamel,
} from "../../utils/index.util";
import reviewModel from "../reviews/review.model";
import bcryptjs from "bcryptjs";

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

    const templateStr = `https://api.themoviedb.org/3/discover/movie?include_video=false&language=en-US&page=${page}&primary_release_date.gte=${req.query["primary_release_date.gte"]}&primary_release_date.lte=${req.query["primary_release_date.lte"]}&with_genres=${req.query["with_genres"]}&sort_by=${req.query["sort_by"]}`;

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
    let newReviews = [];

    // Step 1: Reviews from 3rd party server
    // Step 2: Convert to camel case
    // Step 3: Handle the lack of some fields in REVIEWS cache
    // Step 4: Insert all USERS to mongo server at once
    // Step 5: Extract the ID from these created user
    // Step 6: Get username from reviews cache and find one to the user in mongo after these user created
    // Step : Insert all REVIEWS to mongo server at once

    // Reviews from 3rd party server
    try {
      const cached: any = await getOrSetCache(CACHE_KEY, async () => {
        const response = await fetch(url, OPTIONS);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        return json;
      });

      console.log("Initial Cached = ", cached);
      console.log("Movie ID = ", req.params.movieId);

      // Reviews from mongo server
      const reviewsFromMyServer = await reviewModel
        .find({
          movie: req.params.movieId,
        })
        .populate("author_details.reviewerId")
        .sort({ createdAt: 1 });

      console.log("Reviews from my system: ", reviewsFromMyServer);

      // Convert to camel case
      const onCompleteCached = cached.results.map((item: MovieReviewProps) => {
        const camelCaseItem = _.mapKeys(item, (value, key) => {
          if (key === "created_at" || key === "updated_at") {
            return _.camelCase(key);
          }
          return key;
        });
        return camelCaseItem;
      });

      console.log(
        "On complete cached with camel case converting = ",
        onCompleteCached
      );

      newReviews = [...onCompleteCached] as MovieReviewProps[];

      console.log("\nNew Reviews = ", newReviews);

      const cachedExtractor = cached.results as MovieReviewProps[];
      const salt = await bcryptjs.genSalt(10);
      const mockPassword = await bcryptjs.hash("123456", salt);

      console.log("Cache details: ", cachedExtractor);

      for (const user of cachedExtractor) {
        const lowerUsername = lowerAll(user.author_details.username);
        console.log(
          "Username lowercase = ",
          lowerAll(user.author_details.username)
        );
        const userExist = await userModel.findOne({
          username: lowerAll(user.author_details.username),
        });

        console.log("Is user exist before created = ", userExist);

        if (userExist === null) {
          const newUser = {
            username: lowerUsername,
            email: lowercaseFirstLetter(faker.internet.email()),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: mockPassword,
            gender: faker.helpers.arrayElement(["m", "f", "o"]),
            photo: getRandomPhotoUrl(Math.floor(Math.random() * 131) + 1),
            role: "user",
          };
          newUsers.push(newUser);
        }
      }

      console.log("New users = ", newUsers);

      // Insert all users to mongo server at once
      try {
        // const createdReviews = await reviewModel.insertMany(newReviews);
        // console.log("Reviews created:", createdReviews);
        const createdUser = await userModel.insertMany(newUsers);
        console.log("User created:", createdUser);
      } catch (error) {
        console.error("Error creating user:", error);
        // Handle the error appropriately
      }

      //  Handle the lack of some fields in REVIEWS cache
      let superCached = await Promise.all(
        onCompleteCached.map(async (item: MovieReviewProps) => {
          console.log("Lower all of item author = ", lowerAll(item.author));
          console.log("Item = ", item);
          item.movie = movieId;
          item.author_details.rating = faker.number.float({
            min: 1.0,
            max: 10,
          });
          const userExist = await userModel.findOne({
            username: lowerAll(item.author_details.username),
          });

          console.log("Is user exist = ", userExist);

          if (userExist !== null) {
            item.author_details.username = userExist.username;
            item.author_details.reviewerId = userExist._id;
            item.author_details.name =
              userExist.lastName + " " + userExist.firstName;
            item.author_details.avatar_path = userExist.photo;
          }
          console.log("\nFinal item before insert to mongo = ", item);
          return item;

          // console.log("Is user exist = ", userExist);
        })
      );

      console.log("Super Cached: ", superCached);

      // Insert all reviews to mongo server at once
      try {
        const createdReviews = await reviewModel.insertMany(superCached);
        console.log("Reviews created:", createdReviews);
      } catch (error) {
        console.log(error);
      }

      for (const data of reviewsFromMyServer) {
        onCompleteCached.unshift(data);
      }

      for (const data of onCompleteCached) {
        console.log("Data = ", data);
        const userExist = await userModel.findOne({
          username: data.author_details.username,
        });

        console.log(userExist);
        // userExist.reviews.push
        const reviewsList = await reviewModel.find({
          "author_details.username": userExist.username,
        });

        reviewsList.map((review: any) => {
          userExist.reviews.push(review._id);
        });

        console.log(reviewsList);

        await userExist.save();
        // console.log("Haha", userExist);
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
