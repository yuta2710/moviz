"use strict";
// import { Callback } from "mongoose";
// import Redis from "redis";
Object.defineProperty(exports, "__esModule", { value: true });
// const redisClient: RedisClient = Redis.createClient();
// export default function getOrSetCache(key: string, cb: Callback) {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, async (error, data) => {
//       if (error) {
//         return reject(error);
//       }
//       if (data !== null) return resolve(JSON.parse(data));
//       const freshData = await cb();
//       redisClient.setEx(key, 3600, JSON.stringify(freshData));
//       resolve(freshData);
//     });
//   });
// }
//# sourceMappingURL=cache.util.js.map