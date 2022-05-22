import { Types, Document } from 'mongoose';

export interface Warn {
    guildId : string
    userId  ?: string
    description : string
    createdAt : Date
}

export interface WarnDocument extends Warn, Document {}