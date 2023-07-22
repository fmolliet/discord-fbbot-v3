/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';

const command : Command = {
    name: 'local',
    description: 'Cadastra ou atualiza seu local de Meetings!',
    usage: '[UF]',
    guildOnly: true,
    channelId: '376518334679613440',
    cooldown: 5,
    hasArgs: true,
    async execute( { message, args, furmeetRepository } : CommandParams){
        const state = args![0].toUpperCase();
        
        if( validateState(state) ){

            const furro = await furmeetRepository?.getUserById(message.author.id);
            //message.channel.send(furro!.toString());
            
            if ( furro &&  furro.state === state ){
                return message.reply('você já está cadastrado nesse estado!');
            } else if( furro ) {
                await furmeetRepository?.updateUserState(furro._id!, state.toUpperCase());
                return message.reply('eu acabei de atualizar seu estado!');
            }
            
            await furmeetRepository?.createUser({
                userId: message.author.id,
                state: state,
                active: true
            });
            
            return message.reply('cadastrei aqui seu estado! ... ');
                
        }
        return message.reply(`Estado Inválido: \`' + ${args![0]} + '\` tente outro!'`);

    }
};

export = command;