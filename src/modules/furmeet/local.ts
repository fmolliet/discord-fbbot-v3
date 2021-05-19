import { Command, CommandParams, Furmeet } from '../../interfaces';
import UserRepository from '../../repositories/UserRepository';
import validateState from '../../utils/validateState';

const command : Command = {
    name: 'local',
    description: 'Cadastra ou atualiza seu local de Meetings!',
    usage: '<UF>',
    guildOnly: true,
    channelId: '376518334679613440',
    cooldown: 5,
    hasArgs: true,
    async execute( { message, args, userRepository } : CommandParams){
        // TODO Implement


        if( args && args[0] && validateState(args[0]) ){
                
            await userRepository?.createUser({
                userId: message.author.id,
                state: args[0]
            });
            return message.reply('cadastrei aqui seu estado! ... ');
                
        }
        return message.reply(`Estado Inválido: \`' + ${args?.[0]} + '\` tente outro!'`);

           
        
    }
};

export = command;