import { TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { CommandParams, Command } from '../../interfaces';

const command : Command = {
    name: 'botavatar',
    description: 'Troca o avatar do bot',
    guildOnly: true,
    adminOnly: true,
    execute({ message, client } : CommandParams){
        
        // TODO: Implement

    }
};

export = command;