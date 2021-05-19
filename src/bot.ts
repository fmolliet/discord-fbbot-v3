/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Client, Message, Collection } from 'discord.js';

import glob          from 'glob';
import { promisify } from 'util';

import { RULES  }  from './configs/rules';
import { Command, AppConfig, DatabaseConfig } from './interfaces';
import   database    from './database/connect';
import UserRepository from './repositories/UserRepository';

import { Logger } from './helpers';


const globPromise = promisify(glob);

export class Bot {
    
    private client: Client;
    private readonly token: string | undefined;
    private prefix : string;
    private commands : Collection<string, Command> = new Collection();
    private cooldowns = new Collection();
    
    private databaseConfig: DatabaseConfig;
    private userRepository = new UserRepository();

    constructor( config : AppConfig ) {

        this.client = new Client();
        this.token = config.token;
        this.prefix = config.prefix;
        this.databaseConfig = config.db;
        
    }

    private async handleReady() : Promise<void> {
        
        this.client.once('ready', async() => {
            console.log(`Logado como ${this.client.user?.tag}! | conectado á ${this.client.guilds.valueOf().size} servidores` );
            console.log(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot&permissions=8`);
            this.client.user?.setPresence({
                activity: {
                    type: 'LISTENING',
                    name: 'Furry Brasil 2.0 [v3 - 24/7]',
                }
            });
            // Load Recursive files
            const files = await globPromise('src/modules/**/*.ts');
            
            for (const file of files) {
                const command = await import(file.replace('src/','./').replace('.ts','')) as Command;
                this.commands.set(command.name, command);
            }
            
            database.connect( this.databaseConfig );
            
        });
    }
    
    private handleGuildCreate() : void {
        
        this.client.on('guildCreate', function(guild){
            if ( RULES.whitelistGroups.includes(guild.id) ) {
                return;
            }
            Logger.info(`Tentativa de adicionar o bot ao servidor: ${guild.name} - ${guild.id}`);
            guild.leave();
        });
    }
    
    private handleMessage() : void {
        this.client.on('message', (message: Message) => {
            
            if (!message.content.startsWith(this.prefix) 
                || message.author.bot  
                || message.webhookID ) {
                return;
            }
            
            const args : Array<string> = message.content.slice(this.prefix.length).split(/ +/);
            
            const commandName = args.shift()?.toLowerCase() || '';    
            const command = this.getCommand(commandName);
            
            if (!command) {
                return;
            }
            
            if ( command.hasArgs && ( args.length === 0) ){
                return message.reply(`está faltando informar algo parça! dá uma olhada usando o comando: \`${this.prefix}help ${command.name}\``);
            }
            
            // verifica se são comandos de servidor somente
            if (command.guildOnly && message.channel.type !== 'text') {
                message.delete({ timeout: 1000 });
                return message.reply('Você não executar esse comando dentro do PV!');
            }
            
            if ( command.privateOnly && message.channel.type !== 'dm' ) {
                message.delete({ timeout: 1000 });
                return message.author.send('Esse comando somente pode ser executado no pv!');
            }
            
            if ( command.adminOnly && !  message.guild?.member(message.author.id)?.permissions.has('ADMINISTRATOR') ) {
                return message.reply('Somente administradores podem utilizar esse comando!');
            }
            
            if ( command.ownerOnly && !  RULES.owners.includes(message.author.id)  ) {
                return message.reply('Somente donos podem utilizar esse comando!');
            }
            
            if ( command.hasMention &&  message.mentions.users.size < 1 && args.length < 1 ){
                return message.reply('Parece que você não marcou ninguem e não passou nenhum ID!');
            }
            
            if ( command.hasMention && command.guildOnly ){
                const userID = args[0].includes('<@!') ? 
                    args[0].replace('<@!', '').replace('>', '')
                    : args[0].includes('<@') ?
                        args[0].replace('<@', '').replace('<', '') 
                        : args[0];

                if ( ! message.guild?.member(userID) ) {
                    return message.reply(`Membro não encontrado no servidor com id: \`${userID}\``);
                }
            }
            
            //COOLDOWN
            if (!this.cooldowns.has(command.name)) {
                this.cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps : any = this.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if ( timestamps && timestamps.has(message.author.id)) {
                const expirationTime = timestamps?.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`por favor espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando: \`${command.name}\``);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            // fim cooldown
            
            try {
                command.execute({message, args, commands: this.commands, client: this.client, userRepository: this.userRepository });
            } catch (error) {
                Logger.error(error);
                message.reply('Ocorreu um erro na execução do comando, entre em contato com o dev!');
            }
        });
    }
    
    private getCommand( commandName: string ) :  Command  {
        const command = this.commands.get(commandName) as Command;
        if ( command ) {
            return command;
        }
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