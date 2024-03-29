"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// export type ReviewCustomization = Letterboxd & {
//   film: {
//     title: string;
//     year: string;
//     image: { tiny: string; medi: string; medium: string; large: string };
//   };
//   review?: string;
// };
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Please add a valid username"],
        unique: true,
        // match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, "Please add a valid username"],
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add a valid email",
        ],
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please add a password"],
        select: false,
    },
    gender: {
        type: String,
        enum: ["m", "f", "o"],
        required: [true, "Please add a gender"],
        default: "o",
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager"],
        default: "user",
    },
    watchLists: {
        type: Array,
        default: [],
    },
    followings: {
        type: (Array),
        default: [],
        ref: "User",
    },
    followers: {
        type: (Array),
        default: [],
        ref: "User",
    },
    reviews: {
        type: Array(mongoose_1.Schema.Types.ObjectId),
        ref: "Review",
        default: [],
    },
    photo: {
        type: String,
        default: "https://sepm-bucket.s3.eu-west-1.amazonaws.com/default_avatar.jpeg",
    },
    // resetPasswordToken: String,
    // resetPasswordExpired: String,
    // refreshTokens: [String],
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
});
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// UserSchema.virtual("reviewSchema", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "user",
//   justOne: false,
// });
UserSchema.methods.isValidPassword = async function (currentPassword) {
    console.log(this.password, currentPassword);
    return await bcryptjs_1.default.compare(currentPassword, this.password);
};
// UserSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;
//   return resetToken;
// };
exports.default = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=user.model.js.map