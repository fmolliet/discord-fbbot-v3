/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams, Furmeet } from '../../interfaces';
import FurmeetModel from '../../models/UserFurmeet';
import validateState from '../../utils/validateState';

const command : Command = {
    name: 'fur',
    aliases: ['furs', 'furros'],
    description: 'Lista todos furries de um estado!',
    usage: '<UF>',
    guildOnly: true,
    channelId: '376518334679613440',
    cooldown: 5,
    hasArgs: true,
    async execute( { message, args, userRepository } : CommandParams){
        
        const founded : string[]= [];
        const state = args![0].toUpperCase();
        
        if( validateState(state) ){
                
            const furs = await userRepository?.getUsersByState(state);
            
            if ( furs?.length !== 0  ){
                // TODO: apresentar melhor mensagem ou com variação conforme a quantidade
                message.reply('Localizei uma galera! Estou preparando aqui a lista ...');

                await Promise.all(furs!.map( (fur) => {
                    const furName = message.guild?.member( fur.userId)?.displayName;
                    
                    if ( furName ){
                        founded.push(furName);
                    }
                }));
                
                return message.channel.send(`\`\`\`${founded.join('\n')}\`\`\``, {split: true});

            }
            return message.reply('Infelizmente, não achei ninguem nesse estado!');  
        }
        return message.reply(`Estado Inválido: \`' + ${args![0]} + '\` tente outro!'`);

           
        
    }
};

export = command;