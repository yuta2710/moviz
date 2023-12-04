"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
class ArticleService {
    NY_TIMES_ARTICLES_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22";
    getArticles = async (req, res, next) => {
        // const redisClient = Redis.createClient();
        const page = req.params.page;
        console.table({ page, apiKey: process.env.NEW_YORK_TIMES_API_KEY });
        try {
            const response = await (0, node_fetch_1.default)(`${this.NY_TIMES_ARTICLES_URL}&sort=newest&page=${Number(page)}&api-key=${process.env.NEW_YORK_TIMES_API_KEY}`);
            const json = response.json();
            json.then((data) => {
                res.status(200).json({
                    success: true,
                    data,
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.default = ArticleService;
//# sourceMappingURL=article.service.js.map