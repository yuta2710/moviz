"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const user_validation_1 = require("../user/user.validation");
const auth_validation_1 = require("./auth.validation");
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
class AuthController {
    path = "/auth";
    router = (0, express_1.Router)();
    authService = new auth_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router
            .route(`${this.path}/register`)
            .post((0, validation_middleware_1.validationMiddleware)(user_validation_1.onCreate), this.register);
        this.router
            .route(`${this.path}/login`)
            .post((0, validation_middleware_1.validationMiddleware)(auth_validation_1.onLogin), this.login);
        this.router.route(`${this.path}/me`).get(authentication_middleware_1.protect, this.getMe);
        this.router.route(`${this.path}/forgot-password`).post(this.forgotPassword);
        this.router
            .route(`${this.path}/reset-password-token/:resetPasswordToken`)
            .put(this.resetPassword);
        this.router.route(`${this.path}/logout`).get(this.logOut);
    }
    register = async (req, res, next) => {
        const duoTokens = await this.authService.register(req, res, next);
        this.assignTokenForCookies(req, res, next, duoTokens);
    };
    login = async (req, res, next) => {
        const duoTokens = await this.authService.login(req, res, next);
        this.assignTokenForCookies(req, res, next, duoTokens);
    };
    getMe = async (req, res, next) => {
        res.status(200).json({
            success: true,
            data: await this.authService.getMe(req, res, next),
        });
    };
    assignTokenForCookies = async (req, res, next, duoTokens) => {
        if (duoTokens === undefined || duoTokens instanceof Error) {
            next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], "Something went wrong in returning duo tokens"));
            return;
        }
        if ("refreshToken" in duoTokens) {
            res
                .status(200)
                .cookie("refreshToken", duoTokens.refreshToken, {
                expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 1000),
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
                .json(duoTokens);
        }
    };
    forgotPassword = async (req, res, next) => {
        return this.authService.forgotPassword(req, res, next);
    };
    resetPassword = async (req, res, next) => {
        return this.authService.resetPassword(req, res, next);
    };
    logOut = async (req, res, next) => {
        return this.authService.logOut(req, res, next);
    };
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map