/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Logger } from '../../helpers';
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';

const command : Command = {
    name: 'meeting',
    description: 'Faz um meeting e marca todos da UF!',
    usage: '[UF] [Staff ou mention ou contato ] [Informações sobre o evento]',
    hasArgs: true,
    async execute( { message, args, furmeetRepository } : CommandParams){
        
        let founded = '';
        const state = args![0].toUpperCase();
        const organizer =  message.mentions.users.first()?.username || args![1] ;
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const about = args!.splice(0, 2);
        
        if(args?.length === 0) {
            return message.channel.send('Nenhuma informação foi dada sobre o meet :/');
        }
        
        //Logger.info(args);

        if( validateState(state) ){
                
            const furs = await furmeetRepository?.getUsersByState(state);
            
            if ( furs?.length !== 0  ){
               
                await Promise.all(furs!.map( async (fur) => {
                    const furName = (await message.guild?.members.fetch(fur.userId))?.displayName;
                    // Somente irá iterar sobre furros que estão no servidor
                    if ( furName ){
                        founded += `<@${fur.userId}> `;
                    }
                }));
                
                // Todo? Informar mais dados?
                const mensagem = `Furmeet em **${state} pessoal!**\n${founded}\nOrganizado por: **${organizer}**\nSobre o evento: ${args!.join(' ')}`;

                return message.channel.send(mensagem);
            }
            return message.reply('Infelizmente, não achei ninguem nesse estado para avisar do meet!');  
        }
        return message.reply(`Estado Inválido: \`' + ${args![0]} + '\` tente outro!'`);

           
        
    }
};

export = command;