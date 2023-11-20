import { serverConfig } from "./server";

const port = process.env.UFC_API_REDIS_PORT
  ? Number(process.env.UFC_API_REDIS_PORT)
  : 6379;
const host = process.env.UFC_API_REDIS_HOST
  ? String(process.env.UFC_API_REDIS_HOST)
  : "127.0.0.1";
const username = String(process.env.UFC_API_REDIS_USERNAME);
const password = String(process.env.UFC_API_REDIS_PASSWORD);
const url = serverConfig.isProduction
  ? String(process.env.UFC_API_REDIS_URL)
  : `redis://${host}:${port}`;

export const cacheServerConfig = {
  port,
  host,
  url,
  username,
  password,
};
