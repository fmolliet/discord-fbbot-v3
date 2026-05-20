import { Message } from "discord.js";
import { CONSTANTS } from "../configs/constants";
import { Logger as LOG } from "../helpers";
import isBlacklistArtsChannel from "../utils/isBlacklistArtsChannel";

export default class ArtsChannelHandler {
  async handle(message: Message): Promise<boolean> {
    if (isBlacklistArtsChannel(message)) {
      LOG.warn(`[EVENT] mensagem deletada: ${message.content} no chat: ${message.channel} enviado pelo usuário: ${message.author.username} id: <@${message.author.id}>`);

      const reply = await message.reply(`Este canal é exclusivo para envio de artes. Comentários adicionais devem ser feitos em <#${CONSTANTS.commentaryChannel}> !`);
      
      setTimeout(() => {
        reply.delete().catch(() => {});
      }, 15000);

      await message.delete().catch(() => {});
      return true;
    }
    return false;
  }
}
