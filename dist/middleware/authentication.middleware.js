"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const error_types_setting_util_1 = require("../utils/error-types-setting.util");
const jwt_service_1 = require("../core/jwt/jwt.service");
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const error_response_util_1 = __importDefault(require("../utils/error-response.util"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = async (req, res, next) => {
    let token;
    console.log(req.headers);
    if (req.headers.authorization ||
        req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split("Bearer ")[1].trim();
        console.log("Token kia", token);
    }
    else {
        token = req.cookies.accessToken;
    }
    console.log(token);
    if (!token) {
        next(new error_response_util_1.default(401, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], "Unauthorized to access this routedeedededed"));
        return;
    }
    // console.log("REFRESH TOKEN = ", token);
    try {
        const payload = await (0, jwt_service_1.verifyToken)(token);
        if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], "Something went wrong in payload format"));
        }
        // console.log(payload);
        const user = await user_model_1.default.findById(payload.id).select("-password");
        // console.log(user);
        if (!user) {
            return next(new error_response_util_1.default(404, error_types_setting_util_1.ErrorType["NOT_FOUND"], "User not found"));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new error_response_util_1.default(401, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], "Unauthorized to access this route"));
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new error_response_util_1.default(401, error_types_setting_util_1.ErrorType["UNAUTHORIZED"], `User <${req.user.id}> along with role ${roles} not authorized to access this route`));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authentication.middleware.js.map