import { Message } from "discord.js";
import Redis from "ioredis";
import { Logger } from "../helpers";
const PREFIX: string = "fbbot:furmeet:username:";
class CacheRepository {
    
    private redis: Redis;
    
    private env: string= process.env.ENVIRONMENT!+":"; // dev / hml / prod
    
    private DEFAULT_CACHE_EXPIRATION: number = 86400; // Um dia em segundos
    
    constructor(){
        this.redis = new Redis(process.env.REDIS_URL!);
        Logger.info("Redis configurado...")
    }
    
    async insert(key:string, value: string) {
        this.redis.setex(`${PREFIX}${this.env}${key}`,this.DEFAULT_CACHE_EXPIRATION, value);
    }
    
    async get(key:string) {
        return this.redis.get(`${PREFIX}${this.env}${key}`);
    }
    
    async getNameOfSnowflake(message: Message,snowflake: string){
        const cachedName = await this.get(snowflake);
    
        if (!cachedName) {
            const furMember = await message.guild?.members.fetch(snowflake);
            const furName = furMember?.displayName;
    
            if (furName) {
                this.insert(snowflake, furName);
                //TODO: Update in meeting present
                return furName;
            }
        }
        return cachedName;
    }
}

export default new CacheRepository();