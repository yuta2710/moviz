"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponseMiddleware = void 0;
const error_types_setting_util_1 = require("../utils/error-types-setting.util");
const errorResponseMiddleware = async (err, req, res, next) => {
    const status = err.status || 500;
    const type = err.type || error_types_setting_util_1.ErrorType.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong";
    res.status(status).json({ status, type, message });
};
exports.errorResponseMiddleware = errorResponseMiddleware;
//# sourceMappingURL=error.middleware.js.map