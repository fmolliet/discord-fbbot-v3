import { Command } from '../../types/command';
import { CommandExecuter } from '../../types/CommandExecuter';

const command : Command = {
    name: 'ping',
    description: 'Ping!',
    ownerOnly: true,
    privateOnly: true,
    cooldown: 10,
    execute({ message } : CommandExecuter ){
        message.channel.send('Pong.');
    }
};

export = command;