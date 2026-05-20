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
  TextChannel,
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
import { CONSTANTS } from "./configs/constants";
import InteractionHandler from "./handlers/InteractionHandler";
import Scheduler from "./tasks/Scheduler";
import isFromBotOrWebhook from "./utils/isFromBotOrWebHook";
import ArtsChannelHandler from "./handlers/special/ArtsChannelHandler";
const globPromise = promisify(glob);

export class Bot {
  private client: Client;

  private commands: Collection<string, Command> = new Collection();

  private configuration: AppConfig;
  
  private scheduler: Scheduler;

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
    this.scheduler = new Scheduler(this.client);
    this.configuration = config;

    this.setup()
      .then(() => {
        LOG.info("[INIT] Setup realizado com sucesso!");
      })
      .catch((reason) => {
        LOG.error(`Erro ao configurar o bot: ${reason}`);
      });
  }

  private async handleReady(){
    // Cheat Sheet de dos eventos: https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584#file-discordjs-cheatsheet-js-L141
    const ready = new ReadyHandler();
    this.client.once(Events.ClientReady, ready.handle);
    await database.connect(this.configuration.db);
    await this.scheduleAnnounces();
  }

  private handleErrors(){
    const handler = new ErrorHandler();
    this.client.on(Events.Error, handler.handle);
  }
  
  private handleDebug(){
    this.client.on(Events.Debug, (message)=>{
      LOG.debug(message)
    });
  }
  
  private async scheduleAnnounces(){
    
    await this.scheduler.init();
  }


  private async handleInteraction(){
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      LOG.info(`[EVENT] interação: ${interaction.commandName} pelo usuário: ${interaction.user.username} id: <@${interaction.user.id}>`);
      const command = this.getCommand(interaction.commandName);

      new InteractionHandler().handle(command, interaction);
    });
  }
  
  private async handleModalInteraction(){
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isModalSubmit()) return;
      LOG.info(`[EVENT] Modal Submit: ${interaction.id} pelo usuário: ${interaction.user.username} id: <@${interaction.user.id}>`);
      const comand = this.commands.get(interaction.customId);
      if (comand && comand.handleModalSubmit) {
        await comand.handleModalSubmit(interaction)
      }
    });
  }
  
  private async handleJoinGuild(){
    this.client.on(Events.GuildMemberAdd, (member)=>{
      // Implementação futura de boas vindas
    })
  }
  
  private async handleMessage(): Promise<void> {
    const messageHandler = new MessageHandler(this.client, this.commands);

    this.client.on(Events.MessageCreate, async (message) => {
      if (isFromBotOrWebhook(message)) {
        return;
      }
           
      const artsHandler = new ArtsChannelHandler();
      if (await artsHandler.handle(message)) {
        return;
      }
      
      if (!message.content.startsWith(CONSTANTS.prefix)) {
        return;
      }
      
      LOG.info(`[EVENT] mensagem: ${message.content} pelo usuário: ${message.author.username} id: <@${message.author.id}>`);

      const args: Array<string> = message.content
        .slice(CONSTANTS.prefix.length)
        .split(/ +/);
       const commandName = args.shift()?.toLowerCase();
       if (!commandName) return;
       const command = this.getCommand(commandName);
      
      if ( command == null ){
        LOG.info(`Command não encontrado!`);
        return;
      }
      messageHandler.handle(command, message, args);
    });
  }
  
  public getCommand(commandName: string): Command {
    const command = this.commands.get(commandName) as Command;
    if (command) {
      return command;
    }
    // Realizei um assert non-Null  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
     return this.commands.find(
       (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
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
     const rest = new REST().setToken(this.configuration.token ?? "");

    const supportedCommands = this.commands.filter(
      (command) => command.hasSlashSupport
    );

    LOG.info(
      `[REST] Iniciando atualização de ${supportedCommands.size} comandos (/) de aplicação.`
    );
     const data = (await rest.put(
       Routes.applicationCommands(this.configuration.botId ?? ""),
       { body: supportedCommands }
     )) as Array<Object>;

    LOG.info(
      `[REST] Recarregado com sucessos ${data.length} comandos (/) de aplicação.`
    );
  }
  
  
  private async setup(): Promise<void> {
    this.handleErrors();
    this.handleDebug();
    await this.handleReady();
    await this.loadCommands();
    await this.registerCommands();
     await this.handleInteraction();
    await this.handleModalInteraction();
    await this.handleMessage();
    await removeMuteTask(this.client);
  }

  public async listen(): Promise<string> {
    return this.client.login(this.configuration.token);
  }

  
}
