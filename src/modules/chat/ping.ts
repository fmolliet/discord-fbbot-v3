import { Message } from 'discord.js';
import { Command } from '../../types/command';

const command : Command = {
    name: 'ping',
    description: 'Ping!',
    ownerOnly: true,
    privateOnly: true,
    cooldown: 10,
    execute(message : Message ){
        message.channel.send('Pong.');
    }
};

export = command;