import { MessageAttachment, TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'anunciojogos',
    description: 'Da anuncia no canal de jogos.',
    usage: '[Anuncio]',
    guildOnly: true,
    adminOnly: true,
    async execute({ message, client, twitterService} : CommandParams){

        const channelId = process.env.NODE_ENV === 'dev'? '843694264272814110' : RULES.gameChannel;
        const channel = client?.channels.cache.get(channelId);

        
        
        if (channel?.isText() ) {
            
            const anuncio = message.content.replace('!anunciojogos', '');
            
            if ( message.attachments ){
                const anexos : MessageAttachment[] = [];
                
                for await ( const [snowflake, attachment] of message.attachments){
                    anexos.push(attachment);
                }
                
                (<TextChannel> channel).send(anuncio, { split: true , files: anexos });
            } else {
                (<TextChannel> channel).send(anuncio, { split: true });
            }
           
            await twitterService?.tweet(anuncio);
        }

    }
};

export = command;