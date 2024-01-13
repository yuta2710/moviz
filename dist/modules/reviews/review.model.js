"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    author: {
        // username
        type: String,
        required: true,
    },
    author_details: {
        reviewerId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
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
            // unique: true,
        },
    },
    tag: {
        type: String,
    },
    content: {
        type: String,
        required: true,
        unique: true,
    },
    movie: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
});
// Cascade delete courses when a bootcamp is deleted
exports.default = (0, mongoose_1.model)("Review", reviewSchema);
//# sourceMappingURL=review.model.js.map