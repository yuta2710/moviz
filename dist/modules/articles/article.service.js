"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_util_1 = require("../../utils/cache.util");
const node_fetch_1 = __importDefault(require("node-fetch"));
class ArticleService {
    NY_TIMES_ARTICLES_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22";
    getArticles = async (req, res, next) => {
        const page = req.params.page;
        const CACHE_KEY = `articles?page=${page}`;
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await (0, node_fetch_1.default)(`${this.NY_TIMES_ARTICLES_URL}&sort=newest&page=${Number(page)}&api-key=${process.env.NEW_YORK_TIMES_API_KEY}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                return json;
            });
            res.status(200).json({
                success: true,
                data: cached,
            });
        }
        catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    };
}
exports.default = ArticleService;
//# sourceMappingURL=article.service.js.map