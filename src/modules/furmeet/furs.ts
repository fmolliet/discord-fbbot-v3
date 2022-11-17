/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';

const command : Command = {
    name: 'fur',
    aliases: ['furs', 'furros'],
    description: 'Lista todos furries de um estado!',
    usage: '[UF]',
    guildOnly: true,
    channelId: '376518334679613440',
    cooldown: 5,
    hasArgs: true,
    async execute( { message, args, furmeetRepository } : CommandParams) {
        
        const founded : string[]= [];
        const state = args![0].toUpperCase();
        
        if( validateState(state) ){
                
            const furs = await furmeetRepository?.getUsersByState(state);
            
            if ( furs?.length !== 0  ){
                // TODO: apresentar melhor mensagem ou com variação conforme a quantidade
                message.reply('Localizei uma galera! Estou preparando aqui a lista ...');

                await Promise.all(furs!.map( async (fur) => {
                    const furName = (await message.guild?.members.fetch(fur.userId))?.displayName;
                    
                    if ( furName ){
                        founded.push(furName);
                    }
                }));
                
                return message.channel.send(`\`\`\`${founded.join('\n')}\`\`\``);

            }
            return message.reply('Infelizmente, não achei ninguem nesse estado!');  
        }
        return message.reply(`Estado Inválido: \`' + ${args![0]} + '\` tente outro!'`);

           
        
    }
};

export = command;