import { Snowflake } from 'discord.js';

export interface Furmeet {
    userId : Snowflake,
    state : string,
    city ?: string
}

export interface UserDocument extends Furmeet, Document {}