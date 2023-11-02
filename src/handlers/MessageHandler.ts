import { ChannelType, Client, Collection, Message } from "discord.js";
import { Logger as LOG } from "../helpers";
import { CONSTANTS } from "../configs/Constants";
import { Command } from "../interfaces";
import { promisify } from "util";
import { glob } from "glob";
import InfluxService from "../services/InfluxService";
const globPromise = promisify(glob);

export default class MessageHandler {
  private commands: Collection<string, Command> = new Collection();
  private cooldowns = new Collection();
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async handle(message: Message) {
    const startTime = performance.now();

    if (
      !message.content.startsWith(CONSTANTS.prefix) ||
      message.author.bot ||
      message.webhookId
    ) {
      return;
    }

    LOG.info("Mensagem recebida: " + message.content);
    const args: Array<string> = message.content
      .slice(CONSTANTS.prefix.length)
      .split(/ +/);

    const commandName = args.shift()!.toLowerCase();
    const command = this.getCommand(commandName);

    if (!command) {
      LOG.error("Comando não encontrado!");
      return;
    }
    LOG.info("Comando a se executado: " + command.name.toUpperCase());
    // verifica se são comandos de servidor somente
    if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
      setTimeout(() => {
        message.delete();
      }, 1000);
      message.reply("Esse comando é exclusivo para servidor!");
      return;
    }

    if (command.privateOnly && message.channel.type !== ChannelType.DM) {
      setTimeout(() => {
        message.delete();
      }, 1000);
      message.author.send("Esse comando somente pode ser executado no pv!");
      return;
    }

    if (
      command.adminOnly &&
      !(await message.guild?.members.fetch(message.author.id))?.permissions.has(
        "Administrator"
      ) &&
      !(await message.guild?.members.fetch(message.author.id))?.permissions.has(
        "KickMembers"
      )
    ) {
      message.reply("Somente administradores podem utilizar esse comando!");
      return;
    }

    if (command.ownerOnly && !CONSTANTS.owners.includes(message.author.id)) {
      message.reply("Somente donos podem utilizar esse comando!");
      return;
    }

    if (
      command.hasMention &&
      message.mentions.users.size < 1 &&
      args.length < 1
    ) {
      message.reply(
        "Parece que você não marcou ninguem e não passou nenhum ID!"
      );
      return;
    }

    if (command.hasArgs && args.length === 0) {
      message.reply(
        `está faltando informar algo parça! dá uma olhada usando o comando: \`${CONSTANTS.prefix}help ${command.name}\``
      );
      return;
    }

    if (command.hasMention && command.guildOnly) {
      const mention = args[0];

      const userID = mention
        .replace("<@!", "")
        .replace(">", "")
        .replace("<@", "")
        .replace("<", "");

      if (!(await message.guild?.members.fetch(userID))) {
        message.reply(
          `membro não encontrado no servidor com id: \`${userID}\``
        );
        return;
      }
    }

    if (
      command.hasAttachment &&
      (!message.attachments || message.attachments)
    ) {
      message.reply("não tem nenhum anexo nessa mensagem");
      return;
    }

    // TODO implementar filtro de ChannelID para executar comando somente em um certo canal.

    //COOLDOWN
    if (!this.cooldowns.has(command.name)) {
      this.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps: any = this.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime =
        timestamps?.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        message.reply(
          `por favor espere ${timeLeft.toFixed(
            1
          )} segundo(s) antes de usar o comando: \`${command.name}\``
        );
        return;
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // fim cooldown

    try {
      InfluxService.write("command", command.name);
      InfluxService.write("execution", "uses");
      await command.execute({
        message,
        args,
        commands: this.commands,
        client: this.client,
      });
    } catch (error) {

      InfluxService.write("execution", "error");
      message.reply(
        "Ocorreu um erro na execução do comando, entre em contato com o dev!"
      );
    }
    const endTime = performance.now();
    LOG.info(`Execution time: ${(endTime - startTime).toFixed(3)} ms`);
  }

  async load() {
    const commands = await globPromise("src/modules/**/*.ts");
    if (commands.length < 1) {
      LOG.error("Nenhuma funcionalidade encontrada.");
      throw new Error("No module found");
    }
    for (const file of commands) {
      const command = (await import(
        file.replace("src/", "../").replace(".ts", "")
      )) as Command;

      this.commands.set(command.name, command);
    }
    LOG.info(`${commands.length} módulos de comandos carregados.`);
  }

  getCommand(commandName: string): Command {
    const command = this.commands.get(commandName) as Command;
    if (command) {
      return command;
    }
    // Realizei um assert non-Null  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
    return this.commands.find(
      (cmd) => cmd.aliases! && cmd.aliases.includes(commandName)
    ) as Command;
  }
}
