import { Snowflake } from 'discord.js';
import { Types , Document }  from 'mongoose';

export interface Furmeet {
    _id ?: Types.ObjectId,
    userId : Snowflake,
    state : string,
    city ?: string,
    active: boolean
}

export interface FurmeetDocument extends Furmeet, Document {}