"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const express_1 = require("express");
const review_service_1 = __importDefault(require("./review.service"));
class ReviewController {
    path = "/reviews";
    router = (0, express_1.Router)();
    service = new review_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.route(`${this.path}`).get(this.getAllReviews);
        this.router
            .route(`${this.path}/:movieId`)
            // .get(protect, authorize("admin"), this.getUsers)
            .post(authentication_middleware_1.protect, this.createReview);
    };
    createReview = async (req, res, next) => {
        return this.service.createReviewForMovie(req, res, next);
    };
    getAllReviews = async (req, res, next) => {
        return this.service.getAllReviews(req, res, next);
    };
}
exports.default = ReviewController;
//# sourceMappingURL=review.controller.js.map