/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Client, Message, Collection, ClientEvents, ActivityType, GatewayIntentBits, ChannelType } from 'discord.js';
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
import InfluxService from './services/InfluxService';
import { toNamespacedPath } from 'path/posix';
import { info } from 'console';
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
    
    private _influxService = new InfluxService()    

    constructor( config : AppConfig ) {

        this.client = new Client({intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]});
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
        // Cheat Sheet de dos eventos: https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584#file-discordjs-cheatsheet-js-L141
        
        this.client.once('ready', async() => {
            // Mostrando nome e url para adicionar
            Logger.info(`Logado como ${this.client.user?.tag}! | conectado á ${this.client.guilds.valueOf().size} servidores` );
            Logger.info(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot&permissions=8`);
            // Alterando a presence
            this.client.user?.setPresence({
                activities: [
                    {
                        type: ActivityType.Listening,
                        name: `${process.env.APP_NAME} [v3 - 24/7]`,
                    }
                ]
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
        this.client.on('messageCreate', async (message: Message) => {

            
            if (!message.content.startsWith(this.prefix) 
                || message.author.bot  
                || message.webhookId ) {
                return;
            }
            
            const args : Array<string> = message.content.slice(this.prefix.length).split(/ +/);
            
            const commandName = args.shift()?.toLowerCase() || '';    
            const command = this.getCommand(commandName);
            
            if (!command) {
                return;
            }
            
            // verifica se são comandos de servidor somente
            if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
                setTimeout(()=>{
                    message.delete();
                }, 1000);
                message.reply('Esse comando é exclusivo para servidor!');
                return;
            }
            
            if ( command.privateOnly && message.channel.type !== ChannelType.DM ) {
                
                setTimeout(()=>{
                    message.delete();
                }, 1000);
                message.author.send('Esse comando somente pode ser executado no pv!');
                return;
            }
            
            if ( command.adminOnly &&  !(await message.guild?.members.fetch(message.author.id))?.permissions.has( 'Administrator') && !(await message.guild?.members.fetch(message.author.id))?.permissions.has('KickMembers') ) {
                message.reply('Somente administradores podem utilizar esse comando!');
                return;
            }
            
            if ( command.ownerOnly && !  RULES.owners.includes(message.author.id)  ) {
                message.reply('Somente donos podem utilizar esse comando!');
                return;
            }
            
            if ( command.hasMention &&  message.mentions.users.size < 1 && args.length < 1 ){
                message.reply('Parece que você não marcou ninguem e não passou nenhum ID!');
                return;
            }
                
            if ( command.hasArgs && ( args.length === 0) ){
                message.reply(`está faltando informar algo parça! dá uma olhada usando o comando: \`${this.prefix}help ${command.name}\``);
                return;
            }
            
            if ( command.hasMention && command.guildOnly ){
                const userID = args[0].includes('<@!') ? 
                    args[0].replace('<@!', '').replace('>', '')
                    : args[0].includes('<@') ?
                        args[0].replace('<@', '').replace('<', '') 
                        : args[0];

                if ( ! await message.guild?.members.fetch(userID) ) {
                    message.reply(`membro não encontrado no servidor com id: \`${userID}\``);
                    return;
                }
            }
            
            if ( command.hasAttachment && (!message.attachments ||message.attachments ) ){
                message.reply('não tem nenhum anexo nessa mensagem');
                return;
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
                    message.reply(`por favor espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando: \`${command.name}\``);
                    return;
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            // fim cooldown
            
            try {
                this._influxService.write('command', command.name);
                this._influxService.write('execution', 'uses');
                await command.execute({ message,
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
                console.log(error)
                this._influxService.write('execution', 'error');
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