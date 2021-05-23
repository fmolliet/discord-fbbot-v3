/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cpuUsage, title } from 'process';
import { RULES } from '../../configs/rules';
import { Command, CommandParams } from '../../interfaces';
import { MessageEmbed } from 'discord.js';
import { publicEncrypt } from 'crypto';

const command : Command = {
    name: 'help',
    description: 'Lista de todos os meus comandos ou um comando especifico.',
    aliases: ['commands', 'ajuda'],
    usage: '[command name]',
    cooldown: 5,
    execute({ message , args, commands } : CommandParams) {
        // TODO: refatorar para deixar como na Loritta // E filtrar comandos de adm // Trocar para embed
        const data = [];
        // Adicionado filtro para onwers e admins
        const isAdmin = ( message.channel.type !== 'dm' && message.guild?.member(message.author.id)?.permissions.has('ADMINISTRATOR') ) || RULES.owners.includes(message.author.id);
        const allComands = commands?.map(( command : Command ) => {
            if ( command.adminOnly && isAdmin ) {
                return command.name;
            } else if  ( command.adminOnly && ! isAdmin ) {
                return null;
            } 
            return command.name;
             
        });

        // Buscar de maneira dinamica o prefixo ou ser sempre ! para pv
        if (!args?.length) {
            data.push('Aqui a lista de todos os meus comandos:');
            data.push(allComands?.filter(( command )=> command).join(', '));
            data.push(`\nVocê pode mandar \`${RULES.prefix}help [command name]\` para saber mais sobre algum comando!`);
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') {
                        return;
                    }
                    message.reply('Eu irei te enviar todos os comandos no PV!');
                })
                .catch( ( error: any )=> {
                    console.error(`Não consegui enviar o menu de ajuda para o pv do ${message.author.tag}.\n`, error);
                    message.reply('Não consigo enviar para ti no PV! Você tem DMs desativada?');
                });
        }

        const name = args[0].toLowerCase();
        const command : Command = commands?.get(name) || commands?.find((c: { aliases: any; }) => c.aliases! && c.aliases!.includes(name));

        if (!command) {
            return message.reply('Esse comando não é valido!');
        }

        data.push(`**Nome:** ${command.name}`);

        if (command.aliases) {
            data.push(`**Apelidos:** ${command.aliases.join(', ')}`);
        }
        
        if (command.description) {
            data.push(`**Descrição:** ${command.description}`);
        }
        
        if (command.usage) {
            data.push(`**Exemplo de uso:** ${RULES.prefix}${command.name} ${command.usage}`);
        }

        data.push(`**Cooldown:** ${command.cooldown || 3} segundo(s)`);

        message.channel.send(data, { split: true });

    },
};

export = command;