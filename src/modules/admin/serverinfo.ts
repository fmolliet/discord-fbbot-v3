import { EmbedBuilder } from '@discordjs/builders';
import { CommandParams, Command } from '../../interfaces';

const command : Command = {
    name: 'serverinfo',
    description: 'Retorna dados do servidor.',
    guildOnly: true,
    adminOnly: true,
    async execute( {message } : CommandParams){
        return message.channel.send({embeds: [new EmbedBuilder({
            title: 'Informações o servidor',
            description: 'Abaixo tem algumas informações do servidor',
            fields: [
                {
                    name: 'Nome do servidor',
                    value: message.guild?.name ?? ''
                },
                {
                    name: 'Total membros',
                    value: message.guild?.memberCount.toString() ?? ''
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: `${process.env.APP_NAME}`
            },
            color: (await message.guild?.members.fetch(message.author.id))?.displayColor,
        })]});
    }
};

export = command;