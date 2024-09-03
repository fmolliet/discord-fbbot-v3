import cron from "node-cron";
import { Logger } from '../helpers';
import { Client, StickerType } from "discord.js";
import { EmbedBuilder } from '@discordjs/builders';
import service from "../services/AnnounceService";
import birthdayServices from "../services/BirthdayService";
import calculateNextPostTime from "../utils/calculateNextPostTime";

export default class Scheduler {
    
    private client: Client
    
    constructor(client: Client){
        
        this.client = client;
    }
    
    async init(){
        Logger.info(`[SCHEDULE] Inicializando scheduler!`)
        const client = this.client;
        
        cron.schedule("*/15 * * * *", async()=>{
            Logger.info(`[SCHEDULE] Buscando anuncios...`)
            const announces = await service.getAnnounces();
            Logger.info(announces)
            const now = new Date();
            Logger.info(`[SCHEDULE] ${announces.length} anuncios encontrados!`)
            announces.forEach( async (announce: Announce) => {  
                const nextPostTime = calculateNextPostTime(announce.lastPosted,announce.frequency );
                if (now >=nextPostTime){
                    Logger.info(`[SCHEDULE] Anunciando ${announce._id} no <#${announce.channelId}>`)
                    const channel = await client.channels.fetch(announce.channelId);
                    
                    if (channel?.isTextBased()){
                        
                        await channel.send(announce.message);
                        announce.lastPosted = now;
                        await service.updateAnnounce(announce);
                    }
                }

            })
        })
        
        // TODO: Refatorar
        cron.schedule("0 8 * * *", async()=>{
            //setTimeout(async()=>{
            const now = new Date();
            Logger.info(`[SCHEDULE] Configurando job de aniversário!`)
            const channel = await client.channels.fetch(process.env.BIRTHDAY_CHANNEL_ID ?? "1276005497392074845");

            if (channel?.isTextBased()){
                const birthdays = await birthdayServices.getBirthDaysFromToday();        

                if ( birthdays.length > 0){
                    
                    const aniversarios: string[] = [];
        
                    birthdays.forEach(birthday => {
                        aniversarios.push(`<@${birthday.snowflake}>`);
                    });
                    
                    await channel.send(`:cake: Feliz Aniversário para galera do dia ${this.pad(now.getDate(), 2)}/${this.pad(now.getMonth() + 1, 2)}`)
                    await channel.send(`Aniversariantes de hoje: \n${aniversarios.join("\n")}`);
                    await channel.send(":tada: :birthday: :tada:")
                    await channel.send(":exclamation: Caso queira cadastrar seu aniversário, use o comando `!bd` `<dia>/<mês>` !")
                    await channel.send({stickers: [process.env.BIRTHDAY_STICKER_ID??"1229592033384202241"]})
                } else { 
                    Logger.info(`[SCHEDULE] Ninguem fez aniversário hoje!`)
                }
                
            }
        //}, 1500)
        }, {
            scheduled:true,
            timezone: "America/Sao_Paulo"
        });
    
    }
    
    private pad(num = 0, desiredLength = 2) {
        let paddedNumber = String(num);
        while (paddedNumber.length < desiredLength) {
          paddedNumber = `0${paddedNumber}`;
        }
        return paddedNumber;
    }
    
}