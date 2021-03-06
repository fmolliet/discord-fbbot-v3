import { MessageEmbed } from 'discord.js';
import { CommandParams,Command } from '../../interfaces';

const command : Command = {
    name: 'info',
    description: 'Mostra dados do criador e informações sobre',
    aliases: ['sobre'],
    execute({message } : CommandParams){
        //https://anidiots.guide/first-bot/using-embeds-in-messages
        message.channel.send(new MessageEmbed({
            color: 0xbd00ff,
            title: ':gay_pride_flag: Felix Silva:gay_pride_flag: ',
            description: `Bot mascote do ${process.env.APP_NAME}, Felix nos esteróides`,
            fields: [
                {
                    name: 'Programado por',
                    value: 'Winter#5812'
                },
                {
                    name: 'Liguagem de programação',
                    value: 'Typescript'
                }
            ],
            timestamp: new Date(),
            footer: {
                text: `${process.env.APP_NAME}`
            }
        }
        ));
    }
};

export = command;