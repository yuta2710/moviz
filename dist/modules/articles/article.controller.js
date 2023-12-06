"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_service_1 = __importDefault(require("./article.service"));
class ArticleController {
    path = "/articles";
    router = (0, express_1.Router)();
    service = new article_service_1.default();
    constructor() {
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.route(`${this.path}`).get(this.getArticles);
    };
    getArticles = async (req, res, next) => {
        return this.service.getArticles(req, res, next);
    };
}
exports.default = ArticleController;
//# sourceMappingURL=article.controller.js.map