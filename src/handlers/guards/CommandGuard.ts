import { Message } from "discord.js";
import { Command } from "../interfaces";
import { CONSTANTS } from "../configs/constants";
import PermissionUtils from "../../utils/PermissionUtils";

export default class CommandGuard {
  public async canExecute(command: Command, message: Message, args: Array<string>): Promise<{ allowed: boolean; reason?: string }> {
    if (command.guildOnly && message.channel.type !== 0) {
       return { allowed: false, reason: "Esse comando é exclusivo para servidor!" };
    }

    if (command.privateOnly && message.channel.type !== 1) {
       return { allowed: false, reason: "Esse comando somente pode ser executado no pv!" };
    }

    if (command.adminOnly) {
      const isAdmin = await PermissionUtils.checkAdminPermission(message.author.id, message.guild);
      if (!isAdmin) {
        return { allowed: false, reason: "Somente administradores podem utilizar esse comando!" };
      }
    }

    if (command.ownerOnly && !CONSTANTS.owners.includes(message.author.id)) {
      return { allowed: false, reason: "Somente donos podem utilizar esse comando!" };
    }

    if (command.hasMention && message.mentions.users.size < 1 && args.length < 1) {
      return { allowed: false, reason: "Parece que você não marcou ninguem e não passou nenhum ID!" };
    }

    if (command.hasArgs && args.length === 0) {
      return { allowed: false, reason: `está faltando informar algo parça! dá uma olhada usando o comando: \`${CONSTANTS.prefix}help ${command.name}\`` };
    }

    return { allowed: true };
  }
}
