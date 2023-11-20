"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const movie_model_1 = __importDefault(require("./modules/movie/movie.model"));
const mongo_db_1 = require("./core/db/mongo.db");
console.log(process.env.MONGO_URI);
// Connect to DB
(0, mongo_db_1.connectMongoDB)();
const movies = JSON.parse(fs_1.default.readFileSync(`${__dirname}/data/movies.json`, "utf-8"));
const importData = async () => {
    try {
        console.log(process.env.MONGO_URI);
        await mongoose_1.default.connect(process.env.MONGO_URI);
        await movie_model_1.default.create(movies);
        console.log("Data imported......".green.inverse);
        process.exit();
    }
    catch (err) {
        console.error(err);
    }
};
// const deleteData = async () => {
//   try {
//     await Bootcamp.deleteMany();
//     await Course.deleteMany();
//     await User.deleteMany();
//     console.log("Data deleted......".red.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(err);
//   }
// };
console.log(process.argv);
if (process.argv[2] === "-i") {
    console.log("Alo alo");
    importData();
}
else if (process.argv[2] === "-d") {
    // deleteData();
}
//# sourceMappingURL=seeder.js.map