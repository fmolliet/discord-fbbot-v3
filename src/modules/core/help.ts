/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RULES } from '../../configs/rules';
import { Command, CommandParams } from '../../interfaces';
import { MessageEmbed } from 'discord.js';

const command : Command = {
    name: 'help',
    description: 'Lista de todos os meus comandos ou um comando especifico.',
    aliases: ['commands', 'ajuda'],
    usage: '[Nome do comando]',
    cooldown: 5,
    execute({ message , args, commands } : CommandParams) {
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
            const messageEmbed = new MessageEmbed({
                title: 'Sobre o comando de ajuda:',
                description: 'Lista de todos os meus comandos ou um comando especifico.',
                color: 0xbd00ff,
                fields: [
                    {
                        name: 'Comandos disponíveis para você:',
                        value: allComands?.filter(( command )=> command).join(', ')
                    },
                    {
                        name: 'Obs:',
                        value: `\nVocê pode mandar \`${RULES.prefix}help [Nome do comando]\` para saber mais sobre algum comando!`
                    }
                    
                ],
                timestamp: new Date(),
                footer: {
                    text: `${process.env.APP_NAME}`
                }
            });
      

            return message.author.send(messageEmbed)
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
        
        const messageEmbed = new MessageEmbed({
            title: `Sobre o comando ${command.name}:`,
            description: command.description ? command.description : '',
            color: 0xbd00ff,
            timestamp: new Date(),
            footer: {
                text: `${process.env.APP_NAME}`
            }
        });
 
        if (command.aliases) {
            messageEmbed.addField('Apelidos:', command.aliases.join(', '));
        }
        
        if (command.usage) {
            messageEmbed.addField('Exemplo de uso:', `${RULES.prefix}${command.name} ${command.usage}`);
        }

        messageEmbed.addField('Cooldown:', `${command.cooldown || 3} segundo(s)`);

        //message.channel.send(data, { split: true });
        message.channel.send(messageEmbed);
    },
};

export = command;