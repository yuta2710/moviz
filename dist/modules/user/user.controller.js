"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
class UserController {
    path = "/users";
    router = (0, express_1.Router)();
    service = new user_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes = () => {
        this.router
            .route(`${this.path}`)
            .get(authentication_middleware_1.protect, (0, authentication_middleware_1.authorize)("admin"), this.getUsers)
            .post(authentication_middleware_1.protect, (0, authentication_middleware_1.authorize)("admin"), this.createUser);
        this.router
            .route(`${this.path}/:id`)
            .get(authentication_middleware_1.protect, (0, authentication_middleware_1.authorize)("admin"), this.getUserById)
            .put(authentication_middleware_1.protect, (0, authentication_middleware_1.authorize)("admin"), this.updateUser)
            .delete(authentication_middleware_1.protect, (0, authentication_middleware_1.authorize)("admin"), this.deleteUser);
        // this.router
        //   .route(`${this.path}/:id/reviews`)
        //   .get(protect, this.refreshCurrentUserReviewsFromLetterboxdServer);
        this.router.route(`${this.path}/:id/photo`).patch(authentication_middleware_1.protect, this.setAvatar);
    };
    createUser = async (req, res, next) => {
        try {
            const duoTokens = await this.service.createUser(req, res, next);
            res.status(200).json({
                success: true,
                data: duoTokens,
            });
        }
        catch (error) {
            return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], "Unable to create this user"));
        }
    };
    getUsers = async (req, res, next) => {
        return await this.service.getUsers(req, res, next);
    };
    getUserById = async (req, res, next) => {
        return await this.service.getUserById(req, res, next);
    };
    updateUser = async (req, res, next) => {
        return await this.service.updateUser(req, res, next);
    };
    deleteUser = async (req, res, next) => {
        await this.service.deleteUser(req, res, next);
    };
    setAvatar = async (req, res, next) => {
        return this.service.setAvatar(req, res, next);
    };
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map