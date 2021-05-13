import {Client, Message, Guild} from "discord.js";
import { url } from "inspector";
import { APP } from './configs/app'

export class Bot {
    private client: Client;
    private readonly token: string;

    constructor( client: Client,token: string ) {
        this.client = client;
        this.token = token;
    }

    public listen(): Promise<string> {
        this.client.on('message', (message: Message) => {
            if (!message.content.startsWith(APP.prefix) 
                || message.author.bot  
                || message.webhookID ) return;  

            console.log("Mensagem recebida, conteudo: ", message.content);
        });
        
        this.client.on("guildCreate", function(guild){
            if ( APP.whitelistGroups.includes(guild.id) ) return
            console.log(`Tentativa de adicionar o bot ao servidor: ${guild.name} - ${guild.id}`);
            guild.leave();
        });
        
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

        return this.client.login(this.token);
    }

}