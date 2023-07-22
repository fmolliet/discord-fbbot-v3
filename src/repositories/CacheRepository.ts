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
}

export default new CacheRepository();