"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("../../core/jwt/jwt.service");
const user_model_1 = __importDefault(require("./user.model"));
const error_response_util_1 = __importDefault(require("../../utils/error-response.util"));
const error_types_setting_util_1 = require("../../utils/error-types-setting.util");
class UserService {
    model = user_model_1.default;
    createUser = async (req, res, next) => {
        try {
            const { firstName, lastName, email, password, role, gender } = req.body;
            const user = await this.model.create({
                firstName,
                lastName,
                email,
                password,
                role,
                gender,
            });
            return (0, jwt_service_1.createTokens)(user);
        }
        catch (error) { }
    };
    getUsers = async (req, res, next) => {
        try {
            const users = await this.model.find().lean();
            return users.length === 0
                ? res.status(404).json({
                    success: false,
                    type: error_types_setting_util_1.ErrorType["NOT_FOUND"],
                    message: "No user in this database",
                })
                : res.status(200).json({
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
            const user = await this.model.findById(req.params.id).exec();
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
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map