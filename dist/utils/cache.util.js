"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    port: 6379,
    host: "moviz_cache_server",
    db: 0,
});
exports.redis = redis;
//# sourceMappingURL=cache.util.js.map