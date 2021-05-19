  
import { model, Model, Schema } from 'mongoose';

import { UserDocument } from '../interfaces';

const UserFurmeet: Schema = new Schema({
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

const FurmeetModel: Model<UserDocument> = model('UserFurmeet', UserFurmeet);

export default FurmeetModel;