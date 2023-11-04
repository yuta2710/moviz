"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const connectMongoDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        // console.log(MONGO_URI);
        await mongoose_1.default.connect(MONGO_URI);
        console.log(colors_1.default.green.bold("Database connected successfully"));
    }
    catch (error) {
        throw new Error(`Failed to connected MongoDB`);
    }
};
exports.connectMongoDB = connectMongoDB;
//# sourceMappingURL=mongo.db.js.map