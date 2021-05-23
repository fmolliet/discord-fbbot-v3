  
import { model, Model, Schema } from 'mongoose';

import { TaskDocument } from '../interfaces';

const TasksSchema : Schema = new Schema({
    guildId : {
        type: String,
        required: true,
    },
    userId : {
        type: String,
        required: true,
    },
    type : {
        type: String,
        default: 'removeMute',
    },
    executeOn : {
        type: Date,
        required: true,
    }   
},{
    timestamps: false,
    collection: 'tasks',
    id: false,
});

const TaskModel: Model<TaskDocument> = model('TaskDocument', TasksSchema);

export default TaskModel;