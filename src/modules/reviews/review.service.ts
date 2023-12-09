// import { NextFunction, Request, Response } from "express";
// import userModel from "../user/user.model";
// import { FilmReviewProps } from "./review.interface";
// import { ErrorType } from "../../utils/error-types-setting.util";
// import ErrorResponse from "../../utils/error-response.util";
// import { getOrSetCache } from "../../utils/cache.util";

// interface UserUpdateReviewProps {
//   newReviews: FilmReviewProps[];
// }
// export default class ReviewService {
//   // refreshCurrentUserReviewsFromLetterboxdServer = async (
//   //   req: Request,
//   //   res: Response,
//   //   next: NextFunction
//   // ) => {
//   //   try {
//   //     const updatedUser = await userModel.findByIdAndUpdate(
//   //       req.params.id,
//   //       req.body as Partial<UserUpdateReviewProps>,
//   //       { new: true }
//   //     );
//   //     return updatedUser === null
//   //       ? res.status(404).json({
//   //           success: false,
//   //           type: ErrorType["NOT_FOUND"],
//   //           message: "No user in this database",
//   //         })
//   //       : res.status(200).json({
//   //           success: true,
//   //           data: updatedUser,
//   //         });
//   //   } catch (error) {
//   //     return next(
//   //       new ErrorResponse(
//   //         400,
//   //         ErrorType["BAD_REQUEST"],
//   //         `Unable to update this user <${req.params.id}>`
//   //       )
//   //     );
//   //   }
//   // };
//   // getReviewsByMovieId = async (
//   //   req: Request,
//   //   res: Response,
//   //   next: NextFunction
//   // ) => {
//   //   const { movieId } = req.params;
//   //   const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
//   //   const CACHE_KEY = `film_${movieId}_reviews`;
//   //   const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews`;
//   //   const options = {
//   //     method: "GET",
//   //     headers: {
//   //       accept: "application/json",
//   //       Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
//   //     },
//   //   };
//   //   try {
//   //     const cached = await getOrSetCache(CACHE_KEY, async () => {
//   //       const response = await fetch(url, options);
//   //       if (!response.ok) {
//   //         throw new Error(`HTTP error! Status: ${response.status}`);
//   //       }
//   //       const json = await response.json();
//   //       return json;
//   //     });
//   //     res.status(200).json({
//   //       success: true,
//   //       data: cached,
//   //     });
//   //   } catch (error) {
//   //     res.status(500).json({
//   //       success: false,
//   //       error: "Internal Server Error",
//   //     });
//   //   }
//   // };
// }
