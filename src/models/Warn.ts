  
import { model, Model, Schema } from 'mongoose';

import { WarnDocument } from '../interfaces';

const WarnSchema : Schema = new Schema({
    guildId : {
        type: String,
        required: true,
    },
    userId : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        required: true,
    }   
},{
    timestamps: false,
    collection: 'warns',
    id: false,
});

const WarnModel: Model<WarnDocument> = model('WarnDocument', WarnSchema);

export default WarnModel;