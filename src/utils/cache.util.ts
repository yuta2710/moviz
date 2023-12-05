import Redis, { Callback } from "ioredis";

const redis = new Redis({
  port: 6379,
  host: "moviz_cache_server",
  db: 0,
});

const getOrSetCache = (key: string, cb: Callback) => {
  return new Promise((resolve, reject) => {
    redis.get(key, async (error, data: string) => {
      if (error) return error;
      if (data !== null) return resolve(JSON.parse(data));
      const freshData = await cb();

      redis.setex(key, 3600, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
};

export { redis, getOrSetCache };
