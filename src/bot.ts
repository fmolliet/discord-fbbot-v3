import {Client, Message, Guild, Collection } from 'discord.js';

import glob          from 'glob';
import { promisify } from 'util';

import { RULES  } from './configs/rules';
import { Config } from './types/config';
import { Command } from './types/command';


const globPromise = promisify(glob);

export class Bot {
    private client: Client;
    private readonly token: string | undefined;
    private prefix : string;
    private commands : Collection<string, Command> = new Collection();
    private cooldowns = new Collection();

    constructor( config : Config) {
        this.client = new Client();
        this.token = config.token;
        this.prefix = config.prefix;
        
    }

    private async handleReady() : Promise<void> {
        this.client.once('ready', async () => {
            console.log(`Logado como ${this.client.user?.tag}! | conectado á ${this.client.guilds.valueOf().size} servidores` );
            console.log(`https://discordapp.com/oauth2/authorize?${this.client.user?.id}&scope=bot&permissions=8`);
            this.client.user?.setPresence({
                activity: {
                    type: "LISTENING",
                    name: "Furry Brasil 2.0 [v3 - 24/7]",
                }
            });
            // Load Recursive files
            const files = await globPromise(`src/modules/**/*.ts`);
            
            for (const file of files) {
                const command = await import(file.replace('src/','./').replace('.ts','')) as Command
                this.commands.set(command.name, command);
            }
            
        });
    }
    
    private handleGuildCreate() : void {
        this.client.on("guildCreate", function(guild){
            if ( RULES.whitelistGroups.includes(guild.id) ) return
            console.log(`Tentativa de adicionar o bot ao servidor: ${guild.name} - ${guild.id}`);
            guild.leave();
        });
    }
    
    private handleMessage() : void {
        this.client.on('message', (message: Message) => {
            if (!message.content.startsWith(this.prefix) 
                || message.author.bot  
                || message.webhookID ) return;
            
            const args : Array<string> = message.content.slice(this.prefix.length).split(/ +/);
            
            const commandName = args.shift()?.toLowerCase() || '';    
            const command = this.getCommand(commandName);
            
            if (!command) return;
            
            // verifica se são comandos de servidor somente
            if (command.guildOnly && message.channel.type !== 'text') {
                return message.reply('Você não executar esse comando dentro do PV!');
            }
            
            if ( command.adminOnly && !  message.guild?.member(message.author.id)?.permissions.has("ADMINISTRATOR") ) {
                return message.reply('Somente administradores podem utilizar esse comando!');
            }
            
            //COOLDOWN
            if (!this.cooldowns.has(command.name)) {
                this.cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps : any = this.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if ( timestamps && timestamps.has(message.author.id)) {
                const expirationTime = timestamps!.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`por favor espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando: \`${command.name}\``);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            // fim cooldown
            
            try {
                command.execute(message, args, this.commands );
            } catch (error) {
                console.error(error);
                message.reply('Ocorreu um erro na execução do comando, entre em contato com o dev!');
            }
            
        });
    }
    
    private getCommand( commandName: string ) :  Command  {
        const command = this.commands.get(commandName) as Command
        if ( command ) return command;
        // Realizei um assert non-Null  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
        return this.commands.find( cmd  =>  cmd.aliases! && cmd.aliases!.includes(commandName)) as Command;
    }

    public listen(): Promise<string> {
        
        this.handleMessage();
        this.handleGuildCreate();
        this.handleReady();

        return this.client.login(this.token);
    }

}