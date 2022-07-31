import { MessageEmbed } from 'discord.js';
import { Command, CommandParams } from '../../interfaces';
import getRandomEmoji from '../../utils/getRandomEmoji';

const command : Command = {
    name: 'avatar',
    description: 'Retorna o link do avatar da pessoa marcada.',
    usage: '[Vazio ou Mention ou ID]',
    aliases: ['icon', 'pfp'],
    async execute({ message } : CommandParams){
        if (!message.mentions.users.size) {
            const url = message.author.avatarURL({ format: 'png', size: 2048});
          
            return message.reply(new MessageEmbed({
                title: `${getRandomEmoji()} ${message.author.username}`,
                description: `Baixe a imagem [aqui](${url})!`,
                color: message.guild?.member(message.author.id)?.displayHexColor as string
            }).setImage(url as string));
        }
        
        const mentionedUser = message.mentions.users.first();
        const url = mentionedUser?.avatarURL({ format: 'png', size: 2048});
        const userId = mentionedUser?.id || '';
        
        if ( message.channel.type !== 'dm' ){
            return message.reply(new MessageEmbed({
                title: `${getRandomEmoji()} ${message.author.username}`,
                description: `Baixe a imagem [aqui](${url})!`,
                color: message.guild?.member(userId)?.displayHexColor as string
            }).setImage(url as string));
        }
        
        return message.reply('Só consigo pegar avatar de outras pessoas dentro do servidor!');
    }
};

export = command;