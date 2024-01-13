"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrSetCache = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    port: 6379,
    host: "moviz_cache_server",
    db: 0,
});
exports.redis = redis;
const getOrSetCache = (key, cb) => {
    return new Promise((resolve, reject) => {
        redis.get(key, async (error, data) => {
            if (error)
                return error;
            if (data !== null)
                return resolve(JSON.parse(data));
            const freshData = await cb();
            redis.setex(key, 3600, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
};
exports.getOrSetCache = getOrSetCache;
//# sourceMappingURL=cache.util.js.map