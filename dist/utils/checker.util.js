"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAvatar = void 0;
const photo_type_setting_util_1 = require("./photo-type-setting.util");
const error_response_util_1 = __importDefault(require("./error-response.util"));
const error_types_setting_util_1 = require("./error-types-setting.util");
const isValidAvatar = (file, next) => {
    if (file.mimetype !== photo_type_setting_util_1.PhotoType["PNG"] &&
        file.mimetype !== photo_type_setting_util_1.PhotoType["JPEG"] &&
        file.mimetype !== photo_type_setting_util_1.PhotoType["JPG"] &&
        file.mimetype !== photo_type_setting_util_1.PhotoType["WEBP"]) {
        return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], "Please upload an image"));
    }
    if (Number(file.size) > Number(process.env.MAX_FILE_UPLOAD)) {
        return next(new error_response_util_1.default(400, error_types_setting_util_1.ErrorType["BAD_REQUEST"], `Please upload an image's size less than ${process.env.MAX_FILE_UPLOAD}`));
    }
};
exports.isValidAvatar = isValidAvatar;
//# sourceMappingURL=checker.util.js.map