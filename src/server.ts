import color from "colors";
import App from "./core/app.core";
import "dotenv/config";
import UserController from "./modules/user/user.controller";
import AuthController from "./modules/auth/auth.controller";
import RefreshTokenController from "./modules/refresh-token/refresh-token.controller";
import ArticleController from "./modules/articles/article.controller";
import MovieController from "./modules/movies/movie.controller";

const app = new App(
  [
    new UserController(),
    new AuthController(),
    new RefreshTokenController(),
    new ArticleController(),
    new MovieController(),
  ],

  Number(process.env.PORT)
);

app.listen();
