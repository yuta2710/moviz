import mongoose, { model } from "mongoose";
import Movie from "./movie.interface";

const MovieSchema = new mongoose.Schema({
  rank: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  big_image: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  imdbid: {
    type: String,
    required: true,
  },
  imdb_link: {
    type: String,
    required: true,
  },
});

export default model<Movie>("Movie", MovieSchema);
