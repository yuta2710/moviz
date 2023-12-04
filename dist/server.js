"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_core_1 = __importDefault(require("./core/app.core"));
require("dotenv/config");
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const refresh_token_controller_1 = __importDefault(require("./modules/refresh-token/refresh-token.controller"));
const article_controller_1 = __importDefault(require("./modules/articles/article.controller"));
const app = new app_core_1.default([
    new user_controller_1.default(),
    new auth_controller_1.default(),
    new refresh_token_controller_1.default(),
    new article_controller_1.default(),
], Number(process.env.PORT));
app.listen();
//# sourceMappingURL=server.js.map