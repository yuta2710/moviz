"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const review_model_1 = __importDefault(require("./review.model"));
const index_util_1 = require("../../utils/index.util");
const profanity_1 = require("@2toad/profanity");
const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
const OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
    },
};
const options = new profanity_1.ProfanityOptions();
options.wholeWord = false;
options.grawlix = "*****";
options.grawlixChar = "$";
class ReviewService {
    model = review_model_1.default;
    createReviewForMovie = async (req, res, next) => {
        try {
            const { author, author_details, content, tag, movie } = req.body;
            console.log("Is tuc tieu ? ", profanity_1.profanity.exists(content));
            console.log((0, index_util_1.getAllBadWords)(content));
            let contentProfatter = content;
            if (profanity_1.profanity.exists(content)) {
                contentProfatter = profanity_1.profanity.censor(content);
            }
            const review = await this.model.create({
                author,
                author_details,
                content: contentProfatter,
                tag,
                reviewerId: req.user._id,
                movie,
            });
            const user = req.user;
            console.log("User before = ", user);
            user.reviews.push(review);
            console.log("User after = ", user);
            await user.save();
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
    getAllReviews = async (req, res, next) => {
        try {
            const reviews = await this.model.find({});
            res.status(200).json({
                success: true,
                data: reviews,
            });
        }
        catch (error) {
            next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["INTERNAL_SERVER_ERROR"], "Unable to get these reviews"));
        }
    };
}
exports.default = ReviewService;
//# sourceMappingURL=review.service.js.map