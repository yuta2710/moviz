"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const movie_service_1 = __importDefault(require("./movie.service"));
const express_1 = require("express");
class MovieController {
    path = "/movies";
    router = (0, express_1.Router)();
    service = new movie_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.route(`${this.path}`).get(this.getMovies);
    };
    getMovies = (req, res, next) => {
        return this.service.getMovies(req, res, next);
    };
}
exports.default = MovieController;
//# sourceMappingURL=movie.controller.js.map