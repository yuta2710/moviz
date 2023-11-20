import fs from "fs";
import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
import "dotenv/config";
import movieModel from "./modules/movie/movie.model";
import { connectMongoDB } from "./core/db/mongo.db";

console.log(process.env.MONGO_URI);

// Connect to DB
connectMongoDB();

const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/data/movies.json`, "utf-8")
);

const importData = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    await movieModel.create(movies);
    console.log("Data imported......".green.inverse);
    process.exit();
  } catch (err) {
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
} else if (process.argv[2] === "-d") {
  // deleteData();
}
