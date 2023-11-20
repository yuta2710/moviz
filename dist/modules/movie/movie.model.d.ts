import mongoose from "mongoose";
import Movie from "./movie.interface";
declare const _default: mongoose.Model<Movie, {}, {}, {}, mongoose.Document<unknown, {}, Movie> & Movie & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
