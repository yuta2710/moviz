"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../user/user.model"));
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
class FollowService {
    onFollow = async (req, res, next) => {
        const userIntendToFollow = await user_model_1.default.findById(req.params.id);
        if (userIntendToFollow !== null) {
            if (!userIntendToFollow.followers.includes(req.user._id) &&
                !req.user.followings.includes(userIntendToFollow._id)) {
                userIntendToFollow.followers.push(req.user._id);
                req.user.followings.push(userIntendToFollow._id);
                await userIntendToFollow.save();
                await req.user.save();
            }
            else {
                return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], `Sorry, current user <${req.user.username}> followed new user <${userIntendToFollow.username}> before`));
            }
            res.status(200).json({
                success: true,
                message: `Current user <${req.user.username}> followed new user <${userIntendToFollow.username}> successfully`,
            });
        }
        else {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "User not found."));
        }
    };
    unFollow = async (req, res, next) => {
        const userIntendToUnFollow = await user_model_1.default.findById(req.params.id);
        if (userIntendToUnFollow !== null) {
            if (userIntendToUnFollow.followers.includes(req.user._id) &&
                req.user.followings.includes(userIntendToUnFollow._id)) {
                userIntendToUnFollow.followers.pop();
                req.user.followings.pop();
                await userIntendToUnFollow.save();
                await req.user.save();
            }
            else {
                return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], `Sorry, current user <${req.user.username}> unfollowed new user <${userIntendToUnFollow.username}> before`));
            }
            res.status(200).json({
                success: true,
                message: `Current user <${req.user.username}> unfollowed new user <${userIntendToUnFollow.username}> successfully`,
            });
        }
        else {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "User not found."));
        }
    };
}
exports.default = FollowService;
//# sourceMappingURL=user-follow.service.js.map