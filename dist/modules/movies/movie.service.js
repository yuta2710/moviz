"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_util_1 = require("../../utils/cache.util");
const user_model_1 = __importDefault(require("../user/user.model"));
const lodash_1 = __importDefault(require("lodash"));
const faker_1 = require("@faker-js/faker");
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
        const CACHE_KEY = `movies?page=${page}`;
        const urlArr = [];
        const queryObj = req.query;
        const templateStr = `https://api.themoviedb.org/3/discover/movie?include_video=false&language=en-US`;
        console.table(req.query);
        urlArr.push(templateStr);
        for (let queryKey in queryObj) {
            const queryStr = `&${queryKey}=${queryObj[queryKey]}`;
            urlArr.push(queryStr);
        }
        console.log(urlArr);
        const extractEndpoint = urlArr.join("");
        console.log("Extract endpoint = ", extractEndpoint);
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await fetch(extractEndpoint, OPTIONS);
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
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await fetch(url, OPTIONS);
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