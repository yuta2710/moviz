import Redis from "ioredis";

const redis = new Redis({
  port: 6379,
  host: "moviz_cache_server",
  db: 0,
});

export { redis };
