import { NextFunction, Request, Response } from "express";
import userModel from "../user/user.model";
import { FilmReviewProps } from "./review.interface";
import { ErrorType } from "../../utils/error-types-setting.util";
import ErrorResponse from "../../utils/error-response.util";
import { getOrSetCache } from "../../utils/cache.util";
import reviewModel from "./review.model";
import { MovieReviewProps } from "../movies/movie.interface";
import { faker } from "@faker-js/faker";
import { getAllBadWords, lowercaseFirstLetter } from "../../utils/index.util";
import _ from "lodash";
import { ProfanityOptions, profanity } from "@2toad/profanity";
import Filter from "bad-words";
import { CensorType } from "@2toad/profanity/dist/models";

const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
  },
};

const filter = new Filter();

const options = new ProfanityOptions();

options.wholeWord = false;
options.grawlix = "*****";
options.grawlixChar = "$";

interface UserUpdateReviewProps {
  newReviews: FilmReviewProps[];
}
export default class ReviewService {
  private model = reviewModel;
  createReviewForMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let contentProfatter = "";
    try {
      const { author, author_details, content, tag, movie } =
        req.body as FilmReviewProps;
      console.log("Is tuc tieu ? ", profanity.exists(content));

      console.log(getAllBadWords(content));

      if (profanity.exists(content)) {
        // console.log("Shit word " + filter.clean(content));
        // return next(
        //   new ErrorResponse(
        //     400,
        //     ErrorType["BAD_REQUEST"],
        //     "Your review has some bad words, try again"
        //   )
        // );
        contentProfatter = profanity.censor(content);
      }
      const review = await this.model.create({
        author,
        author_details,
        content: contentProfatter,
        tag,
        movie,
      });

      res.status(200).json({
        success: true,
        message: "Create review successfully",
        data: review,
      });
    } catch (error) {
      next(
        new ErrorResponse(
          404,
          ErrorType["INTERNAL_SERVER_ERROR"],
          "Unable to create this review"
        )
      );
    }
  };

  // getReviewsByMovieId = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { movieId } = req.params;
  //   const CACHE_KEY = `film_${movieId}_reviews`;

  //   const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews`;
  //   const newUsers = [];

  //   try {
  //     const cached: any = await getOrSetCache(CACHE_KEY, async () => {
  //       const response = await fetch(url, OPTIONS);

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const json = await response.json();
  //       return json;
  //     });

  // const reviewsFromMyServer = await this.model.find({});

  // console.log(reviewsFromMyServer);

  //     const userDetails = cached.results as MovieReviewProps[];

  //     for (const user of userDetails) {
  //       const userExist = await userModel.findOne({
  //         username: _.lowerCase(user.author_details.username),
  //       });
  //       if (userExist === null) {
  //         const newUser = {
  //           username: user.author_details.username,
  //           email: lowercaseFirstLetter(faker.internet.email()),
  //           firstName: faker.person.firstName(),
  //           lastName: faker.person.lastName(),
  //           password: "123456",
  //           gender: faker.helpers.arrayElement(["m", "f", "o"]),
  //           role: "user",
  //         };
  //         newUsers.push(newUser);
  //       }
  //     }

  //     try {
  //       const createdUser = await userModel.insertMany(newUsers);
  //       console.log("User created:", createdUser);
  //     } catch (error) {
  //       console.error("Error creating user:", error);
  //       // Handle the error appropriately
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: cached,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: "Internal Server Error",
  //     });
  //   }
  // };
  // refreshCurrentUserReviewsFromLetterboxdServer = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const updatedUser = await userModel.findByIdAndUpdate(
  //       req.params.id,
  //       req.body as Partial<UserUpdateReviewProps>,
  //       { new: true }
  //     );
  //     return updatedUser === null
  //       ? res.status(404).json({
  //           success: false,
  //           type: ErrorType["NOT_FOUND"],
  //           message: "No user in this database",
  //         })
  //       : res.status(200).json({
  //           success: true,
  //           data: updatedUser,
  //         });
  //   } catch (error) {
  //     return next(
  //       new ErrorResponse(
  //         400,
  //         ErrorType["BAD_REQUEST"],
  //         `Unable to update this user <${req.params.id}>`
  //       )
  //     );
  //   }
  // };
  // getReviewsByMovieId = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { movieId } = req.params;
  //   const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
  //   const CACHE_KEY = `film_${movieId}_reviews`;
  //   const url = `https:api.themoviedb.org/3/movie/${movieId}/reviews`;
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
  //     },
  //   };
  //   try {
  //     const cached = await getOrSetCache(CACHE_KEY, async () => {
  //       const response = await fetch(url, options);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const json = await response.json();
  //       return json;
  //     });
  //     res.status(200).json({
  //       success: true,
  //       data: cached,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: "Internal Server Error",
  //     });
  //   }
  // };
}
