import redis from "redis";
import asyncRedis from "async-redis";

const REDISHOST = process.env.REDISHOST || "localhost";
const REDISPORT = process.env.REDISPORT ? +process.env.REDISPORT : 6379;

const client = redis.createClient(REDISPORT, REDISHOST);
client.on("error", (err) => console.error("ERR:REDIS:", err));

const asyncRedisClient = asyncRedis.decorate(client);

export default asyncRedisClient;
