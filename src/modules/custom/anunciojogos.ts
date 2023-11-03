import { Attachment, MessagePayload, TextChannel } from 'discord.js';
import { CONSTANTS } from '../../configs/Constants';
import { Command, CommandParams } from '../../interfaces';
import { Logger } from '../../helpers';
import twitterService from '../../services/TwitterService';

const command : Command = {
    name: 'anunciojogos',
    description: 'Da anuncia no canal de jogos.',
    usage: '[Anuncio]',
    guildOnly: true,
    adminOnly: true,
    async execute({ message, client } : CommandParams){

        const channelId = process.env.NODE_ENV === 'dev'? '843694264272814110' : CONSTANTS.gameChannel;
        const channel = client?.channels.cache.get(channelId);

        
        
        if (channel?.isTextBased() ) {
            
            const anuncio :string = message.content.replace('!anunciojogos', '');
            
            if ( message.attachments ){
                const anexos : Attachment[] = [];
                
                for await ( const [_snowflake, attachment] of message.attachments){
                    anexos.push(attachment);
                }
                
                (<TextChannel> channel).send(new MessagePayload(<TextChannel> channel, { content: anuncio , files: anexos }));
            } else {
                (<TextChannel> channel).send(anuncio);
            }
           
            try {
                await twitterService.tweet(anuncio);
                return message.reply("Postado no chat de anuncio no twitter com sucesso.");
            } catch ( error : any ){
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