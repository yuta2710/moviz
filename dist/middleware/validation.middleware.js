"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const error_types_setting_util_1 = require("../utils/error-types-setting.util");
const error_response_util_1 = __importDefault(require("../utils/error-response.util"));
const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            const values = await schema.validateAsync(req.body, {
                abortEarly: false,
                stripUnknown: true,
                allowUnknown: true,
            });
            req.body = values;
            next();
        }
        catch (error) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["INTERNAL_SERVER_ERROR"], "Unable to validate this middleware"));
        }
    };
};
exports.validationMiddleware = validationMiddleware;
// session device token (fingerPrint)
// refresh token rotation
//# sourceMappingURL=validation.middleware.js.map