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
        // Step 1: Reviews from 3rd party server
        // Step 2: Convert to camel case
        // Step 3: Handle the lack of some fields in REVIEWS cache
        // Step 4: Insert all USERS to mongo server at once
        // Step 5: Extract the ID from these created user
        // Step 6: Get username from reviews cache and find one to the user in mongo after these user created
        // Step : Insert all REVIEWS to mongo server at once
        // Reviews from 3rd party server
        try {
            const cached = await (0, cache_util_1.getOrSetCache)(CACHE_KEY, async () => {
                const response = await fetch(url, OPTIONS);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const json = await response.json();
                return json;
            });
            console.log("Initial Cached = ", cached);
            console.log("Movie ID = ", req.params.movieId);
            // Reviews from mongo server
            const reviewsFromMyServer = await review_model_1.default
                .find({
                movie: req.params.movieId,
            })
                .populate("author_details.reviewerId")
                .sort({ createdAt: 1 });
            console.log("Reviews from my system: ", reviewsFromMyServer);
            // Convert to camel case
            const onCompleteCached = cached.results.map((item) => {
                const camelCaseItem = lodash_1.default.mapKeys(item, (value, key) => {
                    if (key === "created_at" || key === "updated_at") {
                        return lodash_1.default.camelCase(key);
                    }
                    return key;
                });
                return camelCaseItem;
            });
            console.log("On complete cached with camel case converting = ", onCompleteCached);
            newReviews = [...onCompleteCached];
            console.log("\nNew Reviews = ", newReviews);
            const cachedExtractor = cached.results;
            const salt = await bcryptjs_1.default.genSalt(10);
            const mockPassword = await bcryptjs_1.default.hash("123456", salt);
            console.log("Cache details: ", cachedExtractor);
            for (const user of cachedExtractor) {
                const lowerUsername = (0, index_util_1.lowerAll)(user.author_details.username);
                console.log("Username lowercase = ", (0, index_util_1.lowerAll)(user.author_details.username));
                const userExist = await user_model_1.default.findOne({
                    username: (0, index_util_1.lowerAll)(user.author_details.username),
                });
                console.log("Is user exist before created = ", userExist);
                if (userExist === null) {
                    const newUser = {
                        username: lowerUsername,
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
            console.log("New users = ", newUsers);
            // Insert all users to mongo server at once
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
            //  Handle the lack of some fields in REVIEWS cache
            let superCached = await Promise.all(onCompleteCached.map(async (item) => {
                console.log("Lower all of item author = ", (0, index_util_1.lowerAll)(item.author));
                console.log("Item = ", item);
                item.movie = movieId;
                item.author_details.rating = faker_1.faker.number.float({
                    min: 1.0,
                    max: 10,
                });
                const userExist = await user_model_1.default.findOne({
                    username: (0, index_util_1.lowerAll)(item.author_details.username),
                });
                console.log("Is user exist = ", userExist);
                if (userExist !== null) {
                    item.author_details.username = userExist.username;
                    item.author_details.reviewerId = userExist._id;
                    item.author_details.name =
                        userExist.lastName + " " + userExist.firstName;
                    item.author_details.avatar_path = userExist.photo;
                }
                console.log("\nFinal item before insert to mongo = ", item);
                return item;
                // console.log("Is user exist = ", userExist);
            }));
            console.log("Super Cached: ", superCached);
            // Insert all reviews to mongo server at once
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
            for (const data of onCompleteCached) {
                console.log("Data = ", data);
                const userExist = await user_model_1.default.findOne({
                    username: data.author_details.username,
                });
                console.log(userExist);
                // userExist.reviews.push
                const reviewsList = await review_model_1.default.find({
                    "author_details.username": userExist.username,
                });
                reviewsList.map((review) => {
                    userExist.reviews.push(review._id);
                });
                console.log(reviewsList);
                await userExist.save();
                // console.log("Haha", userExist);
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