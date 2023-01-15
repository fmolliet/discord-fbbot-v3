import { Attachment, MessagePayload, TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { CommandParams, Command } from '../../interfaces';
import { Logger } from '../../helpers';
import twitterService from '../../services/TwitterService';

const command : Command = {
    name: 'anuncio',
    description: 'Da anúncio para os membros em um canal específico',
    usage: '[Anuncio]',
    guildOnly: true,
    adminOnly: true,
    async execute({ message, client } : CommandParams){
        
        const channelId = process.env.NODE_ENV === 'dev'? '843694264272814110' : RULES.announceChannel;
        const channel = client?.channels?.cache.get(channelId);

        if (channel?.isTextBased() ) {
            const anuncio = message.content.replace('!anuncio', '');
            
            if ( message.attachments ){
                const anexos : Attachment[] = [];
                
                for await ( const [snowflake, attachment] of message.attachments){
                    anexos.push(attachment);
                }

                (<TextChannel> channel).send(new MessagePayload(<TextChannel> channel, { content: anuncio , files: anexos }));
                
            } else {
                (<TextChannel> channel).send(message.content.replace(anuncio, ''));
            }
            try {
                await twitterService.tweet(anuncio);
                return message.reply("Postado no chat de anuncio no twitter com sucesso.");
            } catch ( error: any ){
                error.response.data.errors.map( (err:any)=>{
                    //Logger.error( err.parameters )
                    Logger.error( "Erro ao enviar twitter: " + err.message )
                });
                Logger.error( `[${error.response.data.title}] ${error.response.data.detail}`)
                return message.reply(`Olha, consegui postar no chat de anuncio, mas deu erro ao chamar o twitter.\nErro detalhado:${error.response.data.detail}`);
            }
            
        }
        return message.reply("Esse canal não é de texto")
    }
};

export = command;