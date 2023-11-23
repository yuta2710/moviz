"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const movie_model_1 = __importDefault(require("./movie.model"));
const error_types_setting_util_1 = require("@/utils/error-types-setting.util");
class MovieService {
    model = movie_model_1.default;
    getMovies = async (req, res, next) => {
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
    getMovieById = async (req, res, next) => {
        try {
            const movie = await this.model.findById(req.params.id);
            return movie === null
                ? res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No movie in this database",
                })
                : res.status(200).json({
                    success: true,
                    data: movie,
                });
        }
        catch (error) {
            throw new Error(`Unable to get this movie <${req.params.id}>`);
        }
    };
}
exports.default = MovieService;
//# sourceMappingURL=movie.service.js.map