import color from "colors";
import App from "./core/app.core";
import "dotenv/config";
import UserController from "./modules/user/user.controller";
import AuthController from "./modules/auth/auth.controller";
import RefreshTokenController from "./modules/refresh-token/refresh-token.controller";
import ArticleController from "./modules/articles/article.controller";

const app = new App(
  [
    new UserController(),
    new AuthController(),
    new RefreshTokenController(),
    new ArticleController(),
  ],

  Number(process.env.PORT)
);

app.listen();
