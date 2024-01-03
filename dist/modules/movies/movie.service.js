"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_util_1 = require("../../utils/cache.util");
const user_model_1 = __importDefault(require("../user/user.model"));
const lodash_1 = __importDefault(require("lodash"));
const faker_1 = require("@faker-js/faker");
const index_util_1 = require("../../utils/index.util");
const review_model_1 = __importDefault(require("../reviews/review.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
const OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
    },
};
class MovieService {
    getMovies = async (req, res, next) => {
        const page = req.query.page;
        const CACHE_KEY = `movies:${JSON.stringify(req.query)}`;
        console.log(CACHE_KEY);
        const templateStr = `https://api.themoviedb.org/3/discover/movie?include_video=false&language=en-US&page=${page}&primary_release_date.gte=${req.query["primary_release_date.gte"]}&primary_release_date.lte=${req.query["primary_release_date.lte"]}&with_genres=${req.query["with_genres"]}&sort_by=${req.query["sort_by"]}`;
        console.table(req.query);
        console.log(templateStr);
        try {
            // console.log("Extract endpoint = ", extractEndpoint);
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                console.log("URL = ", templateStr);
                const response = await fetch(templateStr, OPTIONS);
                console.log("Response = ", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                console.log("The Json extracting = ", json);
                return json;
            });
            res.status(200).json({
                success: true,
                data: cached,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    };
    getMovieById = async (req, res, next) => {
        // 872585
        const id = req.params.id;
        console.log(id);
        const url = `https://api.themoviedb.org/3/movie/${id}`;
        const OPTIONS = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
            },
        };
        const CACHE_MOVIE_DETAIL_KEY = `movie<${id}>`;
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_MOVIE_DETAIL_KEY, async () => {
                const response = await fetch(url, OPTIONS);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                console.log("Json = ", json);
                return json;
            });
            res.status(200).json({
                success: true,
                data: cached,
            });
        }
        catch (error) {
            res.status(200).json({
                success: true,
                error: "Internal Server Error",
            });
        }
    };
    getReviewsByMovieId = async (req, res, next) => {
        const { movieId } = req.params;
        const CACHE_KEY = `film_${movieId}_reviews`;
        const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews`;
        const newUsers = [];
        let newReviews = [];
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await fetch(url, OPTIONS);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                return json;
            });
            console.log("Movie ID = ", req.params.movieId);
            const reviewsFromMyServer = await review_model_1.default
                .find({
                movie: req.params.movieId,
            })
                .sort({ createdAt: 1 });
            console.log("Reviews from my system: ", reviewsFromMyServer);
            const onCompleteCached = cached.results.map((item) => {
                const camelCaseItem = lodash_1.default.mapKeys(item, (value, key) => {
                    if (key === "created_at" || key === "updated_at") {
                        return lodash_1.default.camelCase(key);
                    }
                    return key;
                });
                return camelCaseItem;
            });
            console.log("On complete cached = ", onCompleteCached);
            newReviews = [...onCompleteCached];
            console.log("New Reviews = ", newReviews);
            const superCached = onCompleteCached.map((item) => {
                item.movie = movieId;
                if (item.author_details.name !== null) {
                    item.author_details.name = faker_1.faker.person.fullName();
                }
                item.author_details.rating = faker_1.faker.number.float({ min: 1.0, max: 10 });
                return item;
            });
            console.log("Super Cached: ", superCached);
            try {
                const createdReviews = await review_model_1.default.insertMany(superCached);
                console.log("Reviews created:", createdReviews);
            }
            catch (error) {
                console.log(error);
            }
            for (const data of reviewsFromMyServer) {
                onCompleteCached.unshift(data);
            }
            const userDetails = cached.results;
            const salt = await bcryptjs_1.default.genSalt(10);
            const mockPassword = await bcryptjs_1.default.hash("123456", salt);
            for (const user of userDetails) {
                const userExist = await user_model_1.default.findOne({
                    username: lodash_1.default.lowerCase(user.author_details.username),
                });
                if (userExist === null) {
                    const newUser = {
                        username: user.author_details.username,
                        email: (0, index_util_1.lowercaseFirstLetter)(faker_1.faker.internet.email()),
                        firstName: faker_1.faker.person.firstName(),
                        lastName: faker_1.faker.person.lastName(),
                        password: mockPassword,
                        gender: faker_1.faker.helpers.arrayElement(["m", "f", "o"]),
                        photo: (0, index_util_1.getRandomPhotoUrl)(Math.floor(Math.random() * 131) + 1),
                        role: "user",
                    };
                    newUsers.push(newUser);
                }
            }
            try {
                // const createdReviews = await reviewModel.insertMany(newReviews);
                // console.log("Reviews created:", createdReviews);
                const createdUser = await user_model_1.default.insertMany(newUsers);
                console.log("User created:", createdUser);
            }
            catch (error) {
                console.error("Error creating user:", error);
                // Handle the error appropriately
            }
            res.status(200).json({
                success: true,
                data: onCompleteCached,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    };
    getCastsByMovieId = async (req, res, next) => {
        const id = req.params.movieId;
        const CACHE_CASTS_KEY = `movie<${id}>-casts`;
        const ENDPOINT = `https://api.themoviedb.org/3/movie/${id}/credits`;
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_CASTS_KEY, async () => {
                const response = await fetch(ENDPOINT, OPTIONS);
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
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    };
}
exports.default = MovieService;
//# sourceMappingURL=movie.service.js.map