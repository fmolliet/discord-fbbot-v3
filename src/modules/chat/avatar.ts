import { Message, MessageEmbed } from "discord.js";
import { Command } from '../../types/command';
import getRandomEmoji from '../../utils/getRandomEmoji';

const command : Command = {
    name: "avatar",
    description: "Retorna o link do avatar da pessoa marcada.",
    aliases: ['icon', 'pfp'],
    execute( message : Message ){
        if (!message.mentions.users.size) {
            const url = message.author.avatarURL({ format: 'png', size: 2048});
          
            return message.channel.send(new MessageEmbed({
                title: `${getRandomEmoji()} ${message.author.username}`,
                description: `Baixe a imagem [aqui](${url})!`,
                color: message.guild?.member(message.author.id)?.displayHexColor as string
            }).setImage(url as string));
          }
        
          const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL()}>`;
          });
        
          message.channel.send(avatarList);
    }
}

export = command;