  
import { model, Model, Schema } from 'mongoose';

import { SettingDocument } from '../interfaces';

const SettingsSchema : Schema = new Schema({
    guildId : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    value : {
        type: String,
        required: true,
    },
    type : {
        type: String,
        required: false,
    }   
},{
    timestamps: false,
    collection: 'settings',
    id: false,
});

const SettingModel: Model<SettingDocument> = model('SettingDocument', SettingsSchema);

export default SettingModel;