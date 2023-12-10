import { ChannelType, Client, Collection, Message } from "discord.js";
import { Logger as LOG } from "../helpers";
import { CONSTANTS } from "../configs/Constants";
import { Command } from "../interfaces";

import InfluxService from "../services/InfluxService";

export default class MessageHandler {
  
  private cooldowns = new Collection();
  private client: Client;
  private commands: Collection<string, Command>;

  constructor(client: Client, commands: Collection<string, Command>) {
    this.client = client;
    this.commands = commands;
  }

  public async handle(command: Command, message: Message, args: Array<string>) {
    const startTime = performance.now();
    
    // verifica se são comandos de servidor somente
    if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
      setTimeout(() => {
        message.delete();
      }, 1000);
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} somente no grupo.`);
      message.reply("Esse comando é exclusivo para servidor!");
      return;
    }

    if (command.privateOnly && message.channel.type !== ChannelType.DM) {
      setTimeout(() => {
        message.delete();
      }, 1000);
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} somente DM.`);
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
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} somente para adminstradores.`);
      message.reply("Somente administradores podem utilizar esse comando!");
      return;
    }

    if (command.ownerOnly && !CONSTANTS.owners.includes(message.author.id)) {
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} somente para owner.`);
      message.reply("Somente donos podem utilizar esse comando!");
      return;
    }

    if (
      command.hasMention &&
      message.mentions.users.size < 1 &&
      args.length < 1
    ) {
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} ausência de mensão.`);
      message.reply(
        "Parece que você não marcou ninguem e não passou nenhum ID!"
      );
      return;
    }

    if (command.hasArgs && args.length === 0) {
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} ausência de parâmetros.`);
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
        
        try {
            const member = await message.guild?.members.fetch(userID);
            
            if (!(member)) {
                LOG.warn(`Comando:  + ${command.name.toUpperCase()} membro não encontrado no servidor com id: ${userID}.`);
                message.reply(
                  `Membro não encontrado no servidor com id: \`${userID}\``
                );
                return;
            }
        } catch ( ex){
            LOG.warn(`Comando:  + ${command.name.toUpperCase()} com usuário inválido: ${mention}.`);
            message.reply(
                `Membro inválido: \`${userID}\`, digite novamente!`
            );
            return;
        }
      
    }

    if (
      command.hasAttachment &&
      (!message.attachments || message.attachments)
    ) {
      LOG.warn(`Comando:  + ${command.name.toUpperCase()} não recebeu anexos.`);
      message.reply("não tem nenhum anexo nessa mensagem");
      return;
    }

    /** implementar filtro de ChannelID para executar comando somente em um certo canal.*/

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
      LOG.info("Comando a se executado: " + command.name.toUpperCase());
      InfluxService.write("command", command.name);
      InfluxService.write("execution", "uses");
      await command.execute({
        message,
        args,
        client: this.client,
        commands: this.commands
      });
    } catch (error) {
      LOG.error(error);
      console.log(error);
      InfluxService.write("execution", "error");
      message.reply(
        "Ocorreu um erro na execução do comando, entre em contato com o dev!"
      );
    }
    const endTime = performance.now();
    LOG.debug(`Execution time: ${(endTime - startTime).toFixed(3)} ms`);
  }

  
}
