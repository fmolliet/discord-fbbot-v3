import { EmbedBuilder } from "@discordjs/builders";
import { ChannelType } from "discord.js";
import { Command, CommandParams } from "../../interfaces";
import getRandomEmoji from "../../utils/getRandomEmoji";

const command: Command = {
  name: "avatar",
  description: "Retorna o link do avatar da pessoa marcada.",
  usage: "[Vazio ou Mention ou ID]",
  aliases: ["icon", "pfp"],
  async execute({ message }: CommandParams) {
    if (!message.mentions.users.size) {
      const url = message.author.avatarURL({ extension: "png", size: 2048 });

      return message.reply({
        embeds: [
          new EmbedBuilder({
            title: `${getRandomEmoji()} ${message.author.username}`,
            description: `Baixe a imagem [aqui](${url})!`,
            color: (await message.guild?.members.fetch(message.author.id))
              ?.displayColor,
            image: {
              url: url as string,
            },
          }),
        ],
      });
    }

    const mentionedUser = message.mentions.users.first();
    const url = mentionedUser?.avatarURL({ extension: "png", size: 2048 });
    const userId = mentionedUser?.id ?? "";

    if (message.channel.type !== ChannelType.DM) {
      return message.reply({
        embeds: [
          new EmbedBuilder({
            title: `${getRandomEmoji()} ${message.author.username}`,
            description: `Baixe a imagem [aqui](${url})!`,
            color: (await message.guild?.members.fetch(userId))?.displayColor,
            image: {
              url: url as string,
            },
          }),
        ],
      });
    }

    return message.reply(
      "Só consigo pegar avatar de outras pessoas dentro do servidor!"
    );
  },
};

export = command;
