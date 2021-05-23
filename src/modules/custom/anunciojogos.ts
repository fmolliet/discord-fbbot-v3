import { TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'anunciojogos',
    description: 'Da anuncia no canal de jogos.',
    usage: '[Anuncio]',
    guildOnly: true,
    adminOnly: true,
    execute({ message, client } : CommandParams){

        const channelId = process.env.NODE_ENV === 'dev'? '843694264272814110' : RULES.gameChannel;
        const channel = client?.channels.cache.get(channelId);

        if (channel?.isText() ) {
            (<TextChannel> channel).send(message.content.replace('!anunciojogos', ''), { split: true });
        }

    }
};

export = command;