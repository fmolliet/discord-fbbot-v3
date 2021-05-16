import {Client, Message, Guild} from 'discord.js';
import { url } from 'inspector';

import { RULES  } from './configs/rules'
import { Config } from './types/config';

export class Bot {
    private client: Client;
    private readonly token: string | undefined;
    private prefix : string;

    constructor( config : Config) {
        this.client = new Client();
        this.token = config.token;
        this.prefix = config.prefix;
    }
    
    private handleReady() : void {
        this.client.once('ready', () => {
            console.log(`Logado como ${this.client.user?.tag}! | conectado á ${this.client.guilds.valueOf().size} servidores` );
            console.log(`https://discordapp.com/oauth2/authorize?${this.client.user?.id}&scope=bot&permissions=8`);
            this.client.user?.setPresence({
                activity: {
                    type: "LISTENING",
                    name: "Furry Brasil 2.0 [v3 - 24/7]",
                }
            });
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

            console.log("Mensagem recebida, conteudo: ", message.content);
        });
    }

    public listen(): Promise<string> {
        
        this.handleMessage();
        this.handleGuildCreate();
        this.handleReady();

        return this.client.login(this.token);
    }

}