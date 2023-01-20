import { ClientOpts } from 'redis';
import { DatabaseConfig } from './DatabaseConfig';

export interface AppConfig {
    env: string | undefined;
    token: string | undefined;
    discordBotToken: string | undefined;
    owner: string | undefined;
    prefix: string;
    db: DatabaseConfig,
    test: {
      length: number;
    },
    redis?: string,
    whitelistedServers: string[]
}