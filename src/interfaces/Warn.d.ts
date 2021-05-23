import { Types, Document } from 'mongoose';

export interface Warn {
    _id ?: Types._ObjectId
    guildId : string
    userId  ?: string
    description : string
    createdAt : Date
}

export interface WarnDocument extends Warn, Document {}