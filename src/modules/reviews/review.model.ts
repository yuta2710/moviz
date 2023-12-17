import { model } from "mongoose";
import { FilmReviewProps } from "./review.interface";

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    author: {
      // username
      type: String,
      required: true,
    },
    author_details: {
      name: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      avatar_path: {
        type: String,
        default: null,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
    tag: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    movie: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

export default model<FilmReviewProps>("Review", reviewSchema);
