"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const review_model_1 = __importDefault(require("./review.model"));
const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
const OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
    },
};
class ReviewService {
    model = review_model_1.default;
    createReviewForMovie = async (req, res, next) => {
        try {
            const { author, author_details, content } = req.body;
            const review = await this.model.create({
                author,
                author_details,
                content,
            });
            res.status(200).json({
                success: true,
                message: "Create review successfully",
                data: review,
            });
        }
        catch (error) {
            next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["INTERNAL_SERVER_ERROR"], "Unable to create this review"));
        }
    };
}
exports.default = ReviewService;
//# sourceMappingURL=review.service.js.map