import { Types } from 'mongoose';

export interface Setting {
    _id ?: Types._ObjectId,
    name : string,
    value : string,
    type ?: string
}

export interface SettingDocument extends Setting, Document {}