/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Command,CommandParams } from '../../interfaces';

const command : Command = {
    name: 'setprefix',
    description: 'Troca o prefixo dos comandos',
    usage: '[prefixo]',
    guildOnly: true,
    adminOnly: true,
    hasArgs : true,
    async execute({ message, args, setPrefix }: CommandParams){
        // Não da para fazer injeção de dependencia pois nao passa a referencia da classe
        const newPrefix = args![0];
        if ( newPrefix &&  newPrefix.length > 0 && RegExp(/(!|\$|\.|-)/).exec(newPrefix)){
            setPrefix!(newPrefix);
            return message.reply(`Prefixo alterado para ${newPrefix}`);
        }
        return message.reply('prefixo inválido, tente entre: `!`, `$`, `.`, `-`!');

    }
};

export = command;