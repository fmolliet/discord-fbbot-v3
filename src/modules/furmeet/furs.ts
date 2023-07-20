/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';
import { Logger } from '../../helpers';

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
                message.reply('Vou procurar aqui, um momento')

                await Promise.all(furs!.map( async (fur) => {
                    try { 
                        const furName = (await message.guild?.members.fetch(fur.userId))?.displayName;
                        
                        if ( furName ){
                            founded.push(furName);
                        }
                    } catch (err){
                        Logger.warn(`Não localizado nesse server: ${fur.userId}`);
                        furmeetRepository?.deleteBySnowflake(fur.userId);
                    }
                }));
                
                if ( founded.length >= 1   ){
                    message.channel.send('Localizei uma galera! Aqui a lista com os nomes:');
                    return message.channel.send(`\`\`\`${founded.join('\n')}\`\`\``);
                }

            }
            return message.reply('Infelizmente, não achei ninguem nesse estado!');  
        }
        return message.reply(`Estado Inválido: \`' + ${args![0]} + '\` tente outro!'`);

           
        
    }
};

export = command;