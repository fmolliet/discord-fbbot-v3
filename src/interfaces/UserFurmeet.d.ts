import { Snowflake } from 'discord.js';
import { Types , Document }  from 'mongoose';

export interface Furmeet {
    _id ?: Types._ObjectId,
    userId : Snowflake,
    state : string,
    city ?: string
}

export interface FurmeetDocument extends Furmeet, Document {}