"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_util_1 = require("../../utils/cache.util");
const user_model_1 = __importDefault(require("../user/user.model"));
const lodash_1 = __importDefault(require("lodash"));
const faker_1 = require("@faker-js/faker");
class MovieService {
    getMovies = async (req, res, next) => {
        const page = req.query.page;
        const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
        const CACHE_KEY = `movies?page=${page}`;
        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
            },
        };
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await fetch(url, options);
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
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    };
    getReviewsByMovieId = async (req, res, next) => {
        const { movieId } = req.params;
        const THE_MOVIE_DB_BEARER_TOKEN = process.env.THE_MOVIE_DB_TOKEN;
        const CACHE_KEY = `film_${movieId}_reviews`;
        const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${THE_MOVIE_DB_BEARER_TOKEN}`,
            },
        };
        const newUsers = [];
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                return json;
            });
            const userDetails = cached.results;
            for (const user of userDetails) {
                const userExist = await user_model_1.default.findOne({
                    username: lodash_1.default.lowerCase(user.author_details.username),
                });
                if (userExist === null) {
                    const newUser = {
                        username: user.author_details.username,
                        email: faker_1.faker.internet.email(),
                        firstName: faker_1.faker.person.firstName(),
                        lastName: faker_1.faker.person.lastName(),
                        password: "123456",
                        gender: faker_1.faker.helpers.arrayElement(["m", "f", "o"]),
                        role: "user",
                    };
                    newUsers.push(newUser);
                }
            }
            try {
                const createdUser = await user_model_1.default.insertMany(newUsers);
                console.log("User created:", createdUser);
            }
            catch (error) {
                console.error("Error creating user:", error);
                // Handle the error appropriately
            }
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