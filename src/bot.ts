/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from "discord.js";
import { AppConfig, Command } from "./interfaces";

import database from "./database/connect";

import { Logger as LOG } from "./helpers";
import { removeMuteTask } from "./tasks/RemoveMuteTask";

import MessageHandler from "./handlers/MessageHandler";
import ErrorHandler from "./handlers/ErrorHandler";
import ReadyHandler from "./handlers/ReadyHandler";

import { promisify } from "util";
import { glob } from "glob";
import { CONSTANTS } from "./configs/Constants";
import InteractionHandler from "./handlers/InteractionHandler";
const globPromise = promisify(glob);

export class Bot {
  private client: Client;

  private commands: Collection<string, Command> = new Collection();

  private configuration: AppConfig;

  constructor(config: AppConfig) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.Channel,
        Partials.Reaction,
      ],
    });

    this.configuration = config;

    this.setup()
      .then(() => {
        LOG.info("[INIT] Setup realizado com sucesso!");
      })
      .catch((reason) => {
        LOG.error(`Erro ao configurar o bot: ${reason}`);
      });
  }

  private async handleReady(): Promise<void> {
    // Cheat Sheet de dos eventos: https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584#file-discordjs-cheatsheet-js-L141
    const ready = new ReadyHandler();
    this.client.once(Events.ClientReady, ready.handle);
    await database.connect(this.configuration.db);
  }

  private handleErrors(): void {
    const handler = new ErrorHandler();
    this.client.on(Events.Error, handler.handle);
  }

  private async handleInteration(): Promise<void> {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      LOG.info(`[EVENT] interação: ${interaction.commandName}`);
      const command = this.getCommand(interaction.commandName);

      new InteractionHandler().handle(command, interaction);
    });
  }

  private async handleMessage(): Promise<void> {
    const messageHandler = new MessageHandler(this.client, this.commands);

    this.client.on(Events.MessageCreate, async (message) => {
      if (
        !message.content.startsWith(CONSTANTS.prefix) ||
        message.author.bot ||
        message.webhookId
      ) {
        return;
      }

      LOG.info("[EVENT] mensagem: " + message.content);

      const args: Array<string> = message.content
        .slice(CONSTANTS.prefix.length)
        .split(/ +/);
      const commandName = args.shift()!.toLowerCase();
      const command = this.getCommand(commandName);

      messageHandler.handle(command, message);
    });
  }
  
  public getCommand(commandName: string): Command {
    const command = this.commands.get(commandName) as Command;
    if (command) {
      return command;
    }
    // Realizei um assert non-Null  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
    return this.commands.find(
      (cmd) => cmd.aliases! && cmd.aliases.includes(commandName)
    ) as Command;
  }

  private async loadCommands() {
    const commands = await globPromise("src/modules/**/*.ts");

    if (commands.length < 1) {
      LOG.error("Nenhuma funcionalidade encontrada.");
      throw new Error("No module found");
    }
    for (const file of commands) {
      const command = (await import(
        file.replace("src/", "./").replace(".ts", "")
      )) as Command;

      this.commands.set(command.name, command);
    }
    LOG.info(`[MODULES] ${commands.length} módulos de comandos carregados.`);
  }
  
  private async registerCommands() {
    const rest = new REST().setToken(this.configuration.token!);

    const supportedCommands = this.commands.filter(
      (command) => command.hasSlashSupport
    );

    LOG.info(
      `[REST] Iniciando atualização de ${supportedCommands.size} comandos (/) de aplicação.`
    );
    const data = (await rest.put(
      Routes.applicationCommands(this.configuration.botId!),
      { body: supportedCommands }
    )) as Array<Object>;

    LOG.info(
      `[REST] Recarregado com sucessos ${data.length} comandos (/) de aplicação.`
    );
  }
  
  
  private async setup(): Promise<void> {
    this.handleErrors();
    await this.handleReady();
    await this.loadCommands();
    await this.registerCommands();
    await this.handleInteration();
    await this.handleMessage();
    await removeMuteTask(this.client);
  }

  public async listen(): Promise<string> {
    return this.client.login(this.configuration.token);
  }

  
}
