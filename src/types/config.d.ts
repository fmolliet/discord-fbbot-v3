export interface Config {
    env: string | undefined;
    token: string | undefined;
    discordBotToken: string | undefined;
    owner: string | undefined;
    prefix: string;
    db: {
      host: string | undefined;
      port: string | undefined;
      driver: string | undefined;
      name: string | undefined;
      user: string | undefined;
      password: string | undefined;
    },
    test: {
      length: number;
    },
  }