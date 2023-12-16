import color from "colors";
import App from "./core/app.core";
import "dotenv/config";
import UserController from "./modules/user/user.controller";
import AuthController from "./modules/auth/auth.controller";
import RefreshTokenController from "./modules/refresh-token/refresh-token.controller";
import ArticleController from "./modules/articles/article.controller";
import MovieController from "./modules/movies/movie.controller";
import { lowercaseFirstLetter, toCamel } from "./utils/index.util";
import ReviewController from "./modules/reviews/review.controller";
import _ from "lodash";

const app = new App(
  [
    new UserController(),
    new AuthController(),
    new RefreshTokenController(),
    new ArticleController(),
    new MovieController(),
    new ReviewController(),
  ],

  Number(process.env.PORT)
);

// Example usage
const apiResponse = [
  {
    author: "CinemaSerf",
    author_details: {
      name: "CinemaSerf",
      username: "Geronimo1967",
      avatar_path: "/1kks3YnVkpyQxzw36CObFPvhL5f.jpg",
      rating: 7,
    },
    content:
      'The opening bars of "Pure Imagination" give us a clue as to what\'s coming next, and for the most part it\'s a strong testament to the engaging and charismatic man playing the eponymous chocolatier. He arrives is a town controlled by a chocolate cartel that is determined to use any means possible to ensure he can\'t fulfil his dream. That dream? Well ever since he was a child, he has wanted to make chocolate as well as his mother (Sally Hawkins). To do that, though, he needs a shop - and without a silver sovereign to his name that\'s not going to happen. It\'s winter, so his first order of business is somewhere to sleep. Luckily (?!?) "Bleacher" (Tom Davis) finds him on a cold bench and takes him to the welcoming arms of "Mrs. Scrubbit" (Olivia Colman) who offers him a bed for the night, though pretty soon he realises it\'s more of a bed in return for a life of indentured laundry servitude. Still, he\'s ingenious and he doesn\'t lose sight of his goal, so together with his fellow inmate "Noodle" (Calah Lane) and book-keeper "Abacus Crunch" (Jim Carter) they concoct a plan to addict the population to the young man\'s sweets whilst bringing down the evil trio of truffle terrorisers and ensuring "Scrubbit" and "Bleacher\' get their comeuppance too!. Meantime "Wonka" has other problem. Someone is pinching his product! An elaborate trap and a large jar introduce us to a tiny "Oompa-Loompa" (Hugh Grant) who looks like he\'s spent way too long on the sun-bed. With his own debt to pay, the two agree an alliance that - well we all know what happens to that. It\'s a little over-choreographed, I think, and the original songs are not especially memorable, but it doesn\'t hang about and there\'s no doubting that Chalamet is enjoying himself, and that\'s a little bit contagious and we head to a denouement that takes fondue to a ridiculous level... It features a strong and well matched ensemble cast and though maybe a little too long, I did enjoy it.',
    created_at: "2023-12-11T11:10:25.698Z",
    id: "6576ee219451e70fea6e5a6d",
    updated_at: "2023-12-11T11:10:25.818Z",
    url: "https://www.themoviedb.org/review/6576ee219451e70fea6e5a6d",
  },
  {
    author: "r96sk",
    author_details: {
      name: "",
      username: "r96sk",
      avatar_path: null,
      rating: 8,
    },
    content:
      "Enjoyed this!\r\n\r\n2023's <em>'Wonka'</em> is very good! It's an original story based upon the Roald Dahl novel, so it isn't an adaptation as such like the 1971 and 2005 flicks. With that I didn't find it quite as interesting as what's portrayed in the aforementioned films, but I do appreciate (and prefer, tbh) that they went a different way with it here. And it comes out nicely.\r\n\r\nTimothée Chalamet gives a strong performance in the lead role. Those behind Chalamet are entertaining, from Calah Lane to Keegan-Michael Key to the trio of Paterson Joseph, Matt Lucas and Mathew Baynton - the latter three's dance number for the Chief of Police near the beginning is amusing. The musical elements in general are solid.\r\n\r\nTom Davis and Olivia Colman are fun too. All characters played by those mentioned above after Lane could've easily have been extremely cringey, but thankfully I didn't find that to be the case for any of them at all - very well written, shown and cast in that regard.\r\n\r\nSomeone I have yet to mention is a certain someone as Lofty, an Oompa-Loompa. Hugh Grant is excellent as the orange-skinned, green-haired fellow, even if they did use Grant's best bits in the trailers; which I usually avoid due to those sort of (albeit minor) spoilers, but evidently failed to do so here.\r\n\r\nAll in all, I'd say this is a success. Credit to them for delivering, especially as I was kinda nonplussed by the already noted trailers (Grant aside).",
    created_at: "2023-12-13T17:49:55.027Z",
    id: "6579eec34bfa545d010ab597",
    updated_at: "2023-12-13T17:49:55.163Z",
    url: "https://www.themoviedb.org/review/6579eec34bfa545d010ab597",
  },
  {
    author: "Manuel São Bento",
    author_details: {
      name: "Manuel São Bento",
      username: "msbreviews",
      avatar_path: null,
      rating: 7,
    },
    content:
      'FULL SPOILER-FREE REVIEW @ https://www.firstshowing.net/2023/review-paul-kings-wonka-musical-is-a-truly-delightful-origin-story/\r\n\r\n"Wonka offers a fresh perspective on the iconic character while paying homage to Roald Dahl\'s timeless tale of morality.\r\n\r\nPaul King succeeds in delivering a jolly, entertaining, visually dazzling take on the origins of Willy Wonka, featuring a fearlessly committed cast, tons of humor, and colorful, immersive technical achievements.\r\n\r\nDespite the predictable, formulaic narrative lacking the same creativity of other filmmaking departments, it remains a sweet, harmonious, satisfying viewing experience that should be seen on the big screen."\r\n\r\nRating: B+',
    created_at: "2023-12-15T16:50:33.850Z",
    id: "657c83d9e93e95218eac6a44",
    updated_at: "2023-12-15T16:50:33.956Z",
    url: "https://www.themoviedb.org/review/657c83d9e93e95218eac6a44",
  },
];

// const camelCaseApiResponse = apiResponse.map((item) => {
//   const camelCaseItem = _.mapKeys(item, (value, key) => {
//     if (key === "created_at" || key === "updated_at") {
//       return _.camelCase(key);
//     }
//     return key;
//   });

//   return camelCaseItem;
// });
// console.log("Camelcase API = ", camelCaseApiResponse);

app.listen();
