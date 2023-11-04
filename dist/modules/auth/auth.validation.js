"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLogin = void 0;
const joi_1 = __importDefault(require("joi"));
exports.onLogin = joi_1.default.object({
    email: joi_1.default.string().email().required().trim(),
    password: joi_1.default.string().required().trim(),
});
//# sourceMappingURL=auth.validation.js.map