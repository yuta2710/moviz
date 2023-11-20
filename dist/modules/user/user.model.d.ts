import mongoose from "mongoose";
import User from "./user.interface";
declare const _default: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User> & User & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
