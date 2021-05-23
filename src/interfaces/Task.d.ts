import { Types, Document } from 'mongoose';
import { EVENT } from './Events';

export interface Task {
    _id ?: Types._ObjectId
    guildId : string
    userId ?: string
    type ?: EVENT
    executeOn : Date
}

export interface TaskDocument extends Task, Document {}