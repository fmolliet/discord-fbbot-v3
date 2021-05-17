import { Message, Collection } from "discord.js";
import { RULES } from "../../configs/rules";
import { Command } from '../../types/command';

const command : Command = {
	name: 'help',
	description: 'Lista de todos os meus comandos ou um comando especifico.',
	aliases: ['commands', 'ajuda'],
	usage: '[command name]',
	cooldown: 5,
	execute(message : Message, args?: Array<string>, commands?: Collection<string, Command> ) {
        //https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command
		const data = [];
        //const { commands } = message.client;

        if (!args?.length) {
            data.push('Aqui a lista de todos os meus comandos:');
            data.push(commands!.map(( command : Command ) => command.name).join(', '));
            data.push(`\nVocê pode mandar \`${RULES.prefix}help [command name]\` para saber mais sobre algum comando!`);
            return message.author.send(data, { split: true })
                            .then(() => {
                                if (message.channel.type === 'dm') return;
                                message.reply('Eu irei te enviar todos os comandos no PV!');
                            })
                            .catch( ( error: any )=> {
                                console.error(`Não consegui enviar o menu de ajuda para o pv do ${message.author.tag}.\n`, error);
                                message.reply('Não consigo enviar para ti no PV! Você tem DMs desativada?');
                            });
        }

        const name = args[0].toLowerCase();
        const command = commands!.get(name) || commands!.find(c => c.aliases! && c.aliases!.includes(name));

        if (!command) {
            return message.reply('Esse comando não é valido!');
        }

        data.push(`**Nome:** ${command.name}`);

        if (command.aliases) data.push(`**Apelidos:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Descrição:** ${command.description}`);
        if (command.usage) data.push(`**Uso:** ${RULES.prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} segundo(s)`);

        message.channel.send(data, { split: true });

	},
};

export = command;