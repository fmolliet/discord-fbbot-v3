import { ClientOpts } from 'redis';
import { DatabaseConfig } from './DatabaseConfig';

export interface AppConfig {
    env: string | undefined;
    token: string | undefined;
    botId: string | undefined;
    owner: string | undefined;
    prefix: string;
    db: DatabaseConfig,
    test: {
      length: number;
    },
    redis?: string,
}