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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPhotoUrl = exports.getAllBadWords = exports.lowerAll = exports.toCamel = exports.lowercaseFirstLetter = void 0;
const profanity_1 = require("@2toad/profanity");
const lodash_1 = __importStar(require("lodash"));
function lowercaseFirstLetter(email) {
    if (!email || typeof email !== "string") {
        throw new Error("Invalid email address");
    }
    const [username, domain] = email.split("@");
    if (!username || !domain) {
        throw new Error("Invalid email address format");
    }
    const modifiedUsername = username
        .split(".")
        .map((part, index) => index === 0
        ? part.toLowerCase()
        : part.charAt(0).toLowerCase() + part.slice(1))
        .join(".");
    return modifiedUsername + "@" + domain;
}
exports.lowercaseFirstLetter = lowercaseFirstLetter;
const toCamel = (o) => {
    var newO, origKey, newKey, value;
    if (o instanceof Array) {
        return o.map(function (value) {
            if (typeof value === "object") {
                value = (0, exports.toCamel)(value);
            }
            return value;
        });
    }
    else {
        newO = {};
        for (origKey in o) {
            if (o.hasOwnProperty(origKey)) {
                newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                value = o[origKey];
                if (value instanceof Array ||
                    (value !== null && value.constructor === Object)) {
                    value = (0, exports.toCamel)(value);
                }
                newO[newKey] = value;
            }
        }
    }
    return newO;
};
exports.toCamel = toCamel;
const lowerAll = (data) => {
    return (0, lodash_1.toLower)(lodash_1.default.camelCase(lodash_1.default.toLower(data)));
};
exports.lowerAll = lowerAll;
const getAllBadWords = (sentence) => {
    const splitter = sentence.split(" ");
    const badWordsList = [];
    for (let i = 0; i < splitter.length; i++) {
        const word = splitter[i];
        if (profanity_1.profanity.exists(word)) {
            badWordsList.push(word);
        }
    }
    console.log(badWordsList);
    return badWordsList;
};
exports.getAllBadWords = getAllBadWords;
const getRandomPhotoUrl = (randomId) => {
    return `https://api.slingacademy.com/public/sample-photos/${randomId}.jpeg`;
};
exports.getRandomPhotoUrl = getRandomPhotoUrl;
//# sourceMappingURL=index.util.js.map