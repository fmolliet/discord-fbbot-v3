  
import { model, Model, Schema } from 'mongoose';

import { FurmeetDocument } from '../interfaces';

const FurmeetSchema : Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: false,
    }   
},{
    timestamps: false,
    collection: 'furmeet',
    id: false,
});

const FurmeetModel: Model<FurmeetDocument> = model<FurmeetDocument>('FurmeetDocument', FurmeetSchema);

export default FurmeetModel;