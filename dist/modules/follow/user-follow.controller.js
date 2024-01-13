"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_follow_service_1 = __importDefault(require("./user-follow.service"));
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
class FollowController {
    path = "";
    followPath = "/follow";
    unFollowPath = "/unfollow";
    checkPath = "/check";
    router = (0, express_1.Router)();
    followService = new user_follow_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.route(`${this.followPath}/:id`).post(authentication_middleware_1.protect, this.onFollow);
        this.router.route(`${this.unFollowPath}/:id`).post(authentication_middleware_1.protect, this.unFollow);
        this.router.route(`${this.checkPath}/:id`).get(authentication_middleware_1.protect, this.checkFollowing);
    };
    onFollow = async (req, res, next) => {
        return this.followService.onFollow(req, res, next);
    };
    unFollow = async (req, res, next) => {
        return this.followService.unFollow(req, res, next);
    };
    checkFollowing = async (req, res, next) => {
        return this.followService.checkFollowing(req, res, next);
    };
}
exports.default = FollowController;
//# sourceMappingURL=user-follow.controller.js.map