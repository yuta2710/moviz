"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("../../core/jwt/jwt.service");
const user_model_1 = __importDefault(require("./user.model"));
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
const s3_service_1 = require("../../core/aws/s3.service");
const checker_util_1 = require("../../utils/checker.util");
class UserService {
    model = user_model_1.default;
    createUser = async (req, res, next) => {
        try {
            const { firstName, lastName, username, email, password, role, gender } = req.body;
            console.log("\nUser Register Data = ");
            console.table({
                firstName,
                lastName,
                username,
                email,
                password,
                gender,
                role,
            });
            console.log(gender);
            const user = await this.model.create({
                firstName,
                lastName,
                username,
                email,
                password,
                gender,
                role,
            });
            return (0, jwt_service_1.createTokens)(user);
        }
        catch (error) {
            next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["INTERNAL_SERVER_ERROR"], "Unable to create this user"));
        }
    };
    getUsers = async (req, res, next) => {
        try {
            const users = await this.model.find({});
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No user in this database",
                });
            }
            return res.status(200).json({
                success: true,
                data: users,
            });
        }
        catch (error) {
            return next(new error_response_util_1.default(500, error_types_setting_util_1.ErrorType["INTERNAL_SERVER_ERROR"], "Unable to get all users"));
        }
    };
    getUserById = async (req, res, next) => {
        try {
            const user = await this.model
                .findById(req.params.id)
                .populate("followings")
                .populate("followers")
                .populate("reviews")
                .exec();
            return user === null
                ? res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No user in this database",
                })
                : res.status(200).json({
                    success: true,
                    data: user,
                });
        }
        catch (error) {
            throw new Error(`Unable to get this user <${req.params.id}>`);
        }
    };
    updateUser = async (req, res, next) => {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    deleteUser = async (req, res, next) => {
        try {
            const user = await this.model.findByIdAndDelete(req.params.id);
            return user !== null
                ? res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No user in this database",
                })
                : res.status(200).json({
                    success: true,
                    data: {},
                });
        }
        catch (error) {
            throw new Error(`Unable to delete this user <${req.params.id}>`);
        }
    };
    setAvatar = async (req, res, next) => {
        const user = await this.model.findById(req.params.id);
        if (!user) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "User not found"));
        }
        if (!req.files) {
            console.log("Deo co file nao het");
            return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], "Please upload a file"));
        }
        const file = req.files.file;
        (0, checker_util_1.isValidAvatar)(file, next);
        await (0, s3_service_1.uploadFileToS3)(file);
        const url = await (0, s3_service_1.getUrlFromS3)(file.name);
        const result = await user.updateOne({ photo: url }, { new: true });
        return res.status(200).json({
            success: true,
            message: `Successfully uploaded the photo to S3 bucket and update the avatar of user ${req.params.id}`,
            data: result,
        });
    };
    updateUserProfile = async (req, res, next) => {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return updatedUser === null
                ? res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No user in this database",
                })
                : res.status(200).json({
                    success: true,
                    message: "User profile successfully updated",
                    data: updatedUser,
                });
        }
        catch (error) {
            return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], `Unable to update this user <${req.params.id}>`));
        }
    };
    addMovieToUserWatchList = async (req, res, next) => {
        const movieId = req.params.movieId;
        const user = req.user;
        if (movieId === undefined) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Movie not found"));
        }
        if (!user) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Unauthorize to access this endpoint"));
        }
        try {
            const foundedUser = (await this.model.findById(user._id));
            for (const id in foundedUser.watchLists) {
                if (foundedUser.watchLists[id] === movieId) {
                    console.log(foundedUser.watchLists[id], movieId);
                    return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["BAD_REQUEST"], "Movie has already added"));
                }
            }
            foundedUser.watchLists.push(movieId);
            await foundedUser.save();
            res.status(200).json({
                success: true,
                message: "Add to watchlist successfully",
                data: foundedUser,
            });
        }
        catch (error) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Internal server error"));
        }
    };
    removeMovieFromUserWatchList = async (req, res, next) => {
        const movieId = req.params.movieId;
        const user = req.user;
        if (movieId === undefined) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Movie not found"));
        }
        if (!user) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Unauthorize to access this endpoint"));
        }
        try {
            const foundedUser = (await this.model.findById(user._id));
            const indexToRemove = foundedUser.watchLists.indexOf(movieId);
            console.log(movieId);
            console.log(indexToRemove);
            if (indexToRemove !== -1) {
                foundedUser.watchLists.splice(indexToRemove, 1);
                await foundedUser.save();
            }
            else {
                return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Movie does not exist to calculate by index"));
            }
            res.status(200).json({
                success: true,
                message: "Remove from watchlist successfully",
                data: foundedUser,
            });
        }
        catch (error) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Internal server error"));
        }
    };
    checkWatchlists = async (req, res, next) => {
        const movieId = req.params.movieId;
        const user = req.user;
        if (movieId === undefined) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Movie not found"));
        }
        if (!user) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Unauthorize to access this endpoint"));
        }
        try {
            const foundedUser = (await this.model.findById(user._id));
            if (foundedUser.watchLists.includes(movieId)) {
                res.status(200).json({
                    success: true,
                    message: `Current user <${foundedUser.username}> has this movie ${movieId} in their WatchLists`,
                    isInWatchLists: true,
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    message: `Current user <${foundedUser.username}> doesn't have this movie ${movieId} in their WatchLists`,
                    isInWatchLists: false,
                });
            }
        }
        catch (error) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "Internal server error"));
        }
    };
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map