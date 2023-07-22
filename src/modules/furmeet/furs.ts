/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';
import { Logger } from '../../helpers';
import cacheRepository from '../../repositories/CacheRepository';

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
                        const cached_name = await cacheRepository.get(fur.userId);
                        
                        if ( cached_name){
                            if ( cached_name != "N/A")
                                founded.push(cached_name);
                        } else {
                            const furName = (await message.guild?.members.fetch(fur.userId))?.displayName;
                            
                            if ( furName ){
                                cacheRepository.insert(fur.userId, furName)
                                founded.push(furName);
                            } 
                        }

                    } catch (err){
                        Logger.error(`Error para snowflake ${fur.userId}: ${err}.`);
                        //await furmeetRepository?.deactive(fur);
                        cacheRepository.insert(fur.userId, "N/A")
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