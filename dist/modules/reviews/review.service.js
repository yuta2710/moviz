"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../user/user.model"));
const error_types_setting_util_1 = require("@/utils/error-types-setting.util");
const error_response_util_1 = __importDefault(require("@/utils/error-response.util"));
class ReviewService {
    refreshCurrentUserReviewsFromLetterboxdServer = async (req, res, next) => {
        try {
            const updatedUser = await user_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return updatedUser === null
                ? res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No user in this database",
                })
                : res.status(200).json({
                    success: true,
                    data: updatedUser,
                });
        }
        catch (error) {
            return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], `Unable to update this user <${req.params.id}>`));
        }
    };
}
exports.default = ReviewService;
//# sourceMappingURL=review.service.js.map