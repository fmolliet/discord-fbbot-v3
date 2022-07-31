import { MessageAttachment, TextChannel } from 'discord.js';
import { RULES } from '../../configs/rules';
import { Command, CommandParams } from '../../interfaces';
import { Logger } from '../../helpers';

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
           
            try {
                await twitterService?.tweet(anuncio);
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