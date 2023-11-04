"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.onCreate = joi_1.default.object({
    firstName: joi_1.default.string().required().trim(),
    lastName: joi_1.default.string().required().trim(),
    email: joi_1.default.string().email().required().trim(),
    password: joi_1.default.string().required().min(6).trim(),
    role: joi_1.default.string().required().trim(),
});
//# sourceMappingURL=user.validation.js.map