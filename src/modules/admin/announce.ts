import { TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { CommandParams, Command } from '../../interfaces';

const command : Command = {
    name: 'anuncio',
    description: 'Da anúncio para os membros em um canal específico',
    usage: '[Anuncio]',
    guildOnly: true,
    adminOnly: true,
    execute({ message, client } : CommandParams){
        
        const channelId = process.env.NODE_ENV === 'dev'? '843694264272814110' : RULES.announceChannel;
        const channel = client?.channels.cache.get(channelId);

        if (channel?.isText() ) {
            (<TextChannel> channel).send(message.content.replace('!anuncio', ''), { split: true });
        }

    }
};

export = command;