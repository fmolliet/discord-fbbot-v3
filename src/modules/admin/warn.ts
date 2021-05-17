import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../types/command';

const command : Command = {
    name: 'warn',
    description: 'Da warn nos membros trouxas',
    guildOnly: true,
    adminOnly: true,
    hasMention: true,
    execute(message: Message){
        message.channel.send('Warn');
        // TODO: desenvolver funcionalide de warn
        
    }
};

export = command;