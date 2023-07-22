import Redis from "ioredis";
import { Logger } from "../helpers";

class CacheRepository {
    
    private redis: Redis;
    
    private env: string= process.env.ENVIRONMENT!+":";
    private DEFAULT_PREFIX: string = "fbbot:furmeet:username:";
    private DEFAULT_CACHE_EXPIRATION: number = 86400;
    
    constructor(){
        this.redis = new Redis(process.env.REDIS_URL!);
        Logger.info("Redis configurado...")
    }
    
    async insert(key:string, value: string) {
        this.redis.setex(`${this.DEFAULT_PREFIX}${this.env}${key}`,this.DEFAULT_CACHE_EXPIRATION, value);
    }
    
    async get(key:string) {
        return this.redis.get(`${this.DEFAULT_PREFIX}${this.env}${key}`);
    }
}

export default new CacheRepository();