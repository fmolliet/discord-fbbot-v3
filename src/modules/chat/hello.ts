import { Collection, Message } from "discord.js";
import { RULES } from "../../configs/rules";
import { Command } from '../../types/command';

const command : Command = {
    name: "hello",
    aliases: ['olar', 'ola', 'hellor', 'hellow', 'oi'],
    description: "Manda uns olar pra quem mandar o comando",
    execute( message : Message ){
        if(message.author.id === RULES.owner )
            message.channel.send(":wave: Oi pai! >w<");
        else 
            message.channel.send(":smiley: :wave: Olár Furro! <a:owo:474420880617897996>");
    }
}

export = command;