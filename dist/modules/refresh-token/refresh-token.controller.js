"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refresh_token_service_1 = __importDefault(require("./refresh-token.service"));
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
class RefreshTokenController {
    path = "/auth";
    router = (0, express_1.Router)();
    refreshTokenService = new refresh_token_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.route("/refresh-token").get(authentication_middleware_1.protect, this.handleRefreshToken);
    }
    handleRefreshToken = async (req, res, next) => {
        return this.refreshTokenService.handleRefreshToken(req, res, next);
    };
}
exports.default = RefreshTokenController;
//# sourceMappingURL=refresh-token.controller.js.map