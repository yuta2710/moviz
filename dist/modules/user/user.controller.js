"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
class UserController {
    path = "/users";
    router = (0, express_1.Router)();
    service = new user_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.route(`${this.path}`).get(this.getUsers).post(this.createUser);
        this.router
            .route(`${this.path}/:id`)
            .get(this.getUserById)
            .put(this.updateUser)
            .delete(this.deleteUser);
    };
    createUser = async (req, res, next) => {
        try {
            const { firstName, lastName, email, password, role, gender } = req.body;
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
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map