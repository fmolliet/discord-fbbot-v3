import cron from "node-cron";
import { Logger } from '../helpers';
import { Client } from "discord.js";
import service from "../services/AnnounceService";
import calculateNextPostTime from "../utils/calculateNextPostTime";

export default class Scheduler {
    
    private client: Client
    
    constructor(client: Client){
        
        this.client = client;
    }
    
    async init(){
        Logger.info(`[SCHEDULE] Inicializando scheduler`)
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
    
    }

    
}