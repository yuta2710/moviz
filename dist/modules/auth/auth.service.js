"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../user/user.service"));
const user_model_1 = __importDefault(require("../user/user.model"));
const jwt_service_1 = require("../../core/jwt/jwt.service");
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const send_email_util_1 = require("../../utils/send-email.util");
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
class AuthService {
    userService = new user_service_1.default();
    register = async (req, res, next) => {
        const duoTokens = await this.userService.createUser(req, res, next);
        return duoTokens;
    };
    login = async (req, res, next) => {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "User does not exist"));
            return;
        }
        const isMatchPassword = await user.isValidPassword(password);
        if (!isMatchPassword) {
            next(new error_response_util_1.default(401, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], "Invalid password"));
            return;
        }
        const duoTokens = await (0, jwt_service_1.createTokens)(user);
        if ("refreshToken" in duoTokens) {
            user.refreshTokens.push(duoTokens.refreshToken);
            await user.save();
        }
        return duoTokens;
    };
    getMe = async (req, res, next) => {
        const user = await user_model_1.default
            .findById(req.user.id)
            .select("-password");
        return user;
    };
    forgotPassword = async (req, res, next) => {
        const user = await user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            return next(new error_response_util_1.default(401, error_types_setting_util_1.ErrorType["NOT_FOUND"], "User not found"));
        }
        const resetPasswordToken = user.getResetPasswordToken();
        console.log("User old rpt = ", resetPasswordToken);
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${req.protocol}://${req.get("host")}`;
        const message = `You are receiving this email because you (or someone else)
    has requested the reset of password.
    Please make a PUT request to: \n\n ${resetUrl}/api/v1/auth/reset-password-token/${user.resetPasswordToken}`;
        try {
            await (0, send_email_util_1.sendEmail)({
                email: user.email,
                subject: "Day la reset  token password cua may ne",
                message,
            });
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            return next(new error_response_util_1.default(403, error_types_setting_util_1.ErrorType["BAD_REQUEST"], "Email could not be sent"));
        }
    };
    resetPassword = async (req, res, next) => {
        const updatedUser = await user_model_1.default.findOne({
            resetPasswordToken: req.params.resetPasswordToken,
            resetPasswordExpired: { $gt: Date.now() },
        });
        console.log(req.body.password);
        console.log(updatedUser);
        if (!updatedUser) {
            return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], "Invalid token"));
        }
        // Set the new password from this.modified() in model is not trigger
        updatedUser.password = req.body.password;
        updatedUser.resetPasswordToken = undefined;
        updatedUser.resetPasswordExpired = undefined;
        await updatedUser.save();
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    };
    logOut = async (req, res, next) => {
        res.cookie("refreshToken", "none", {
            httpOnly: true,
            expires: new Date(Date.now() + 10 * 1000),
        });
        // res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: `Log out the account successfully`,
            data: {},
        });
    };
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map