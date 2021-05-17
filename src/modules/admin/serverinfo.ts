import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../types/command';

const command : Command = {
    name: 'serverinfo',
    description: 'Retorna dados do servidor',
    guildOnly: true,
    adminOnly: true,
    execute( message : Message){
        message.channel.send(new MessageEmbed({
            title: 'Informações o servidor',
            description: 'Abaixo tem algumas informações do servidor',
            fields: [
                {
                    name: 'Nome do servidor',
                    value: message.guild?.name
                },
                {
                    name: 'Total membros',
                    value: message.guild?.memberCount
                }
            ],
            timestamp: new Date(),
            footer: {
                text: 'Furry Brasil 2.0'
            },
            color: message.guild?.member(message.author.id)?.displayHexColor as string,
        }));
    }
};

export = command;