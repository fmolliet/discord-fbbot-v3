/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Client, GatewayIntentBits, } from 'discord.js';
import {  AppConfig } from './interfaces';

import database    from './database/connect';

import { Logger as LOG } from './helpers';
import { removeMuteTask } from './tasks/RemoveMuteTask';

import MessageHandler from './handlers/MessageHandler';
import ErrorHandler from './handlers/ErrorHandler';
import ReadyHandler from './handlers/ReadyHandler';

export class Bot {
    
    private client:Client;
    
    private configuration: AppConfig;  
   
    constructor( config : AppConfig ) {

        this.client = new Client({intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.DirectMessageReactions
        ]});

        this.configuration = config;
        this.setup().then(()=>{
            LOG.info("Setup realizado com sucesso!");
        }).catch((reason)=>{
            LOG.error(`Erro ao configurar o bot: ${reason}`);
        })
    }

    private async handleReady() : Promise<void> {
        // Cheat Sheet de dos eventos: https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584#file-discordjs-cheatsheet-js-L141
        const ready = new ReadyHandler();
        this.client.once('ready', ready.handle);
        await database.connect( this.configuration.db ); 
    }
    
    private handleErrors(): void {
        const error = new ErrorHandler();
        this.client.on("error", error.handle);
    }
    
    private handleMessage() : void {
        const message = new MessageHandler(this.client);
        this.client.on('messageCreate', message.handle);
        
    }
    
    private async setup(){
        this.handleMessage();
        this.handleErrors();
        await this.handleReady();
        // busco no banco as config
        // Busco no banco As tarefas -> memoria 
        await removeMuteTask( this.client );
    }
    
    public async listen(): Promise<string> {
        return this.client.login(this.configuration.token);
    }
}