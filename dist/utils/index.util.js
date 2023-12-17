"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBadWords = exports.toCamel = exports.lowercaseFirstLetter = void 0;
const profanity_1 = require("@2toad/profanity");
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
//# sourceMappingURL=index.util.js.map