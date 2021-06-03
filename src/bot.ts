/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Client, Message, Collection } from 'discord.js';
import { Command, AppConfig, DatabaseConfig } from './interfaces';
import glob          from 'glob';
import { promisify } from 'util';

import { RULES }   from './configs/rules';
import database    from './database/connect';

import FurmeetRepository from './repositories/FurmeetRepository';
import TaskRepository    from './repositories/TaskRepository';
import WarnRepository    from './repositories/WarnRepository';

import { Logger } from './helpers';
import { RemoveMuteTask } from './tasks/RemoveMuteTask';
//import { ClientOpts, RedisClient } from 'redis';
//import {  } from './tasks';


const globPromise = promisify(glob);

export class Bot {
    
    private client: Client;
    private readonly token: string | undefined;
    private prefix : string;
    
    private commands : Collection<string, Command> = new Collection();
    private cooldowns = new Collection();
    
    private databaseConfig: DatabaseConfig;
    
    private furmeetRepository = new FurmeetRepository();
    private taskRepository    = new TaskRepository();
    private warnRepository    = new WarnRepository();
    

    constructor( config : AppConfig ) {

        this.client = new Client();
        this.token = config.token;
        this.prefix = config.prefix;
        this.databaseConfig = config.db;
       
    }
    
    private setPrefix( prefix: string) : void{
        this.prefix = prefix;
    }
    
    private async setup(){
        // busco no banco as config
        // Busco no banco As tarefas -> memoria 
        await RemoveMuteTask( this.client, this.taskRepository );
    }

    private async handleReady() : Promise<void> {
        
        this.client.once('ready', async() => {
            // Mostrando nome e url para adicionar
            Logger.info(`Logado como ${this.client.user?.tag}! | conectado á ${this.client.guilds.valueOf().size} servidores` );
            Logger.info(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot&permissions=8`);
            // Alterando a presence
            this.client.user?.setPresence({
                activity: {
                    type: 'LISTENING',
                    name: 'Furry Brasil 2.0 [v3 - 24/7]',
                }
            });
            // Load Recursive files
            const files = await globPromise('src/modules/**/*.ts');
            
            for await (const file of files) {
                const command = await import(file.replace('src/','./').replace('.ts','')) as Command;
                this.commands.set(command.name, command);
            }
            Logger.info('Funcionalidades carregadas.');
            
            await database.connect( this.databaseConfig ); 
            await this.setup();
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
            
            // verifica se são comandos de servidor somente
            if (command.guildOnly && message.channel.type !== 'text') {
                message.delete({ timeout: 1000 });
                return message.reply('Esse comando é exclusivo para servidor!');
            }
            
            if ( command.privateOnly && message.channel.type !== 'dm' ) {
                message.delete({ timeout: 1000 });
                return message.author.send('Esse comando somente pode ser executado no pv!');
            }
            
            if ( command.adminOnly &&  !message.guild?.member(message.author.id)?.permissions.has('ADMINISTRATOR') && !message.guild?.member(message.author.id)?.hasPermission('KICK_MEMBERS') ) {
                return message.reply('Somente administradores podem utilizar esse comando!');
            }
            
            if ( command.ownerOnly && !  RULES.owners.includes(message.author.id)  ) {
                return message.reply('Somente donos podem utilizar esse comando!');
            }
            
            if ( command.hasMention &&  message.mentions.users.size < 1 && args.length < 1 ){
                return message.reply('Parece que você não marcou ninguem e não passou nenhum ID!');
            }
                
            if ( command.hasArgs && ( args.length === 0) ){
                return message.reply(`está faltando informar algo parça! dá uma olhada usando o comando: \`${this.prefix}help ${command.name}\``);
            }
            
            if ( command.hasMention && command.guildOnly ){
                const userID = args[0].includes('<@!') ? 
                    args[0].replace('<@!', '').replace('>', '')
                    : args[0].includes('<@') ?
                        args[0].replace('<@', '').replace('<', '') 
                        : args[0];

                if ( ! message.guild?.member(userID) ) {
                    return message.reply(`membro não encontrado no servidor com id: \`${userID}\``);
                }
            }
            
            if ( command.hasAttachment && !message.attachments.first() ){
                return message.reply('não tem nenhum anexo nessa mensagem');
            }
            
            // TODO implementar filtro de ChannelID para executar comando somente em um certo canal.
            
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
                command.execute({ message,
                    args,
                    commands: this.commands,
                    client: this.client,
                    setPrefix: this.setPrefix,
                    furmeetRepository: this.furmeetRepository,
                    taskRepository: this.taskRepository,
                    warnRepository: this.warnRepository
                });
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