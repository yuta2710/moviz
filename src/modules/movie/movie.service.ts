import { NextFunction, Request, Response } from "express";
import movieModel from "./movie.model";
import { ErrorType } from "@/utils/error-types-setting.util";
import ErrorResponse from "@/utils/error-response.util";

export default class MovieService {
  private model = movieModel;
  getMovies = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //   const movies = await this.model.find({});
    //   if (movies.length === 0) {
    //     return res.status(404).json({
    //       success: false,
    //       type: ErrorType["NOT_FOUND"],
    //       message: "No user in this database",
    //     });
    //   }
    //   return res.status(200).json({
    //     success: true,
    //     data: movies,
    //   });
    // } catch (error) {
    //   return next(
    //     new ErrorResponse(
    //       500,
    //       ErrorType["INTERNAL_SERVER_ERROR"],
    //       "Unable to get all movies"
    //     )
    //   );
    // }
  };

  getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = await this.model.findById(req.params.id);

      return movie === null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No movie in this database",
          })
        : res.status(200).json({
            success: true,
            data: movie,
          });
    } catch (error) {
      throw new Error(`Unable to get this movie <${req.params.id}>`);
    }
  };
}
