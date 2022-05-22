import { Types, Document } from 'mongoose';

export interface Setting {
    guildId: string
    name : string
    value : string
    type ?: string
}

export interface SettingDocument extends Setting, Document {}