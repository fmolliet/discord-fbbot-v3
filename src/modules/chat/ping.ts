import { Collection, Message } from "discord.js";
import { Command } from '../../types/command';

const command : Command = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 10,
    execute(message : Message ){
        message.channel.send('Pong.');
    }
}

export = command;