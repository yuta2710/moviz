"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNewRefreshToken = exports.extractUser = exports.removeRefreshTokenFromUser = exports.removeAllRefreshTokensFromUser = exports.getUserByRefreshToken = exports.assignRefreshTokenToUser = exports.refreshTokenReuseDetection = exports.verifyToken = exports.createTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
const createTokens = async (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    const duoTokens = { accessToken, refreshToken };
    console.log(duoTokens);
    return duoTokens;
};
exports.createTokens = createTokens;
const verifyToken = async (accessToken) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, payload) => {
            if (err)
                reject(err);
            resolve(payload);
        });
    });
};
exports.verifyToken = verifyToken;
const refreshTokenReuseDetection = async (decodedUser, refreshToken, res, next) => {
    // Find refresh token in db
    const queryRefreshToken = await (0, exports.getUserByRefreshToken)(decodedUser.id, refreshToken);
    if (!queryRefreshToken) {
        console.log("RT is verified but is not present in the database ===> A Hacker is sending this token !!!");
        await (0, exports.removeAllRefreshTokensFromUser)(decodedUser.id);
        res.clearCookie("refreshToken");
        next(new error_response_util_1.default(403, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], "Refresh Token is invalid !"));
        return true;
    }
    return false;
};
exports.refreshTokenReuseDetection = refreshTokenReuseDetection;
const assignRefreshTokenToUser = async (userId, refreshToken) => {
    const updateUser = await user_model_1.default.findByIdAndUpdate(userId, {
        $push: { refreshTokens: refreshToken },
    }, { new: true });
    return updateUser;
};
exports.assignRefreshTokenToUser = assignRefreshTokenToUser;
const getUserByRefreshToken = async (userId, refreshToken) => {
    const user = await user_model_1.default.findOne({
        _id: userId,
        refreshTokens: { $in: [refreshToken] },
    });
    // console.log(user);
    return user;
};
exports.getUserByRefreshToken = getUserByRefreshToken;
const removeAllRefreshTokensFromUser = async (userId) => {
    const updatedUser = await user_model_1.default.updateOne({ userId }, { refreshTokens: [] });
    return updatedUser;
};
exports.removeAllRefreshTokensFromUser = removeAllRefreshTokensFromUser;
const removeRefreshTokenFromUser = async (userId, refreshToken) => {
    const updatedUser = await user_model_1.default.updateOne({ userId }, { refreshTokens: { $pull: refreshToken } });
    return updatedUser;
};
exports.removeRefreshTokenFromUser = removeRefreshTokenFromUser;
const extractUser = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw error;
    }
};
exports.extractUser = extractUser;
const updateNewRefreshToken = async (userId, oldRefreshToken, newRefreshToken) => {
    const updatedUser = await user_model_1.default.updateOne({ _id: userId, refreshTokens: oldRefreshToken }, {
        $set: {
            "refreshTokens.$": newRefreshToken,
        },
    });
    return updatedUser;
};
exports.updateNewRefreshToken = updateNewRefreshToken;
//# sourceMappingURL=jwt.service.js.map