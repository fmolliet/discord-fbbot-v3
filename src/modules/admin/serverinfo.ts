import { MessageEmbed } from 'discord.js';
import { CommandParams, Command } from '../../interfaces';

const command : Command = {
    name: 'serverinfo',
    description: 'Retorna dados do servidor.',
    guildOnly: true,
    adminOnly: true,
    async execute( {message } : CommandParams){
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
                text: `${process.env.APP_NAME}`
            },
            color: message.guild?.member(message.author.id)?.displayHexColor as string,
        }));
    }
};

export = command;