import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'ping',
    description: 'Ping!',
    ownerOnly: true,
    privateOnly: true,
    cooldown: 10,
    execute({ message } : CommandParams ){
        message.channel.send('Pong.');
    }
};

export = command;