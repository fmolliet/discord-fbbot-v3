import { Command } from '../../types/command';
import { CommandExecuter } from '../../types/CommandExecuter';

const command : Command = {
    name: 'warn',
    description: 'Da warn nos membros trouxas',
    guildOnly: true,
    adminOnly: true,
    hasMention: true,
    execute({message } : CommandExecuter){
        message.channel.send('Warn');
        // TODO: desenvolver funcionalide de warn
        
    }
};

export = command;