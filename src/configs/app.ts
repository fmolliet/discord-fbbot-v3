import { AppConfig } from "../interfaces";

export const config: AppConfig = {
  env: process.env.NODE_ENV,
  token: process.env.DISCORD_TOKEN,
  botId: process.env.DISCORD_BOTID,
  owner: process.env.BOT_OWNER,
  prefix: "!",
  db: {
    port: process.env.DB_PORT ?? "",
    host: process.env.DB_HOST ?? "",
    collection: process.env.DB_COLLECTION ?? "discordbot",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
  },
  test: {
    length: 44,
  },
  redis: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
};
