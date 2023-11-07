import * as redis from "redis";
import { RedisClientType } from "redis";
import { Logger } from "../../logger/logger";

class RedisHelper {
  private _client: RedisClientType | null = null;
  private _url: string | null = null;

  async connect(url: string): Promise<void> {
    this._url = url;

    Logger.info(`[REDIS] ::: Opening connection to ${this._url}`);

    this._client = redis.createClient({
      url: url,
    });

    this._client.on("error", (error) => {
      Logger.error(`[REDIS] ::: Client error  ${error}`);

      return Promise.reject(error);
    });

    this._client.on("connect", () => {
      Logger.info(`[REDIS] ::: Connected to redis server at ${url}`);
    });

    await this._client.connect();
  }

  getConnection(): RedisClientType | null {
    return this._client;
  }

  getConnectionURL(): string | null {
    return this._url;
  }
  async disconnect(): Promise<void> {
    Logger.info(`[REDIS] ::: Closing connection`);
    await this._client?.quit();
  }
}

export const redisConnectionHelper = new RedisHelper();
