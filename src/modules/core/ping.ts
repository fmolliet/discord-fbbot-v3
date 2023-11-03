import { Command, CommandParams } from '../../interfaces';

const pong= "Pong!";

const command : Command = {
    name: 'ping',
    description: 'Ping!',
    ownerOnly: true,
    privateOnly: true,
    cooldown: 10,
    dm_permission: true,
    hasSlashSupport: true,
    slash: async( interaction)=>{
        interaction.reply(pong)
    },
    async execute({ message } : CommandParams ){
        return message.channel.send(pong);
    }
};

export = command;