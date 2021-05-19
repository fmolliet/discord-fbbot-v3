import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'warn',
    description: 'Da warn nos membros trouxas',
    guildOnly: true,
    adminOnly: true,
    hasMention: true,
    execute({message } : CommandParams){
        message.channel.send('Warn');
        // TODO: desenvolver funcionalide de warn
        
    }
};

export = command;