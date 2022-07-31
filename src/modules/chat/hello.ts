import { RULES } from '../../configs/rules';
import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'hello',
    aliases: ['olar', 'ola', 'hellor', 'hellow', 'oi'],
    description: 'Manda uns olar pra quem mandar o comando',
    async execute({ message } : CommandParams){
        if(message.author.id === RULES.owner ) {
            return message.channel.send(':wave: Oi pai! >w<');
        } else {
            return message.channel.send(':smiley: :wave: Olár Furro! <a:owo:474420880617897996>');
        }
    }
};

export = command;