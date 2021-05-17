import { TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { Command } from '../../types/command';
import { CommandExecuter } from '../../types/CommandExecuter';

const command : Command = {
    name: 'anuncio',
    description: 'Da anuncia para os trouxas',
    guildOnly: true,
    adminOnly: true,
    execute({ message, client } : CommandExecuter){
        
        const channelId = process.env.NODE_ENV === 'dev'? '843694264272814110' : RULES.announceChannel;
        const channel = client?.channels.cache.get(channelId);

        if (channel?.isText() ) {
            (<TextChannel> channel).send(message.content.replace('!anuncio', ''), { split: true });
        }

    }
};

export = command;