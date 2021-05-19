import { Mongoose, Types } from 'mongoose';
import { Snowflake } from 'discord.js';

import FurmeetModel from '../models/UserFurmeet';
import { Furmeet } from '../interfaces';

export default class UserRepository {
    
    public async getUserById( userId: Snowflake ): Promise<Furmeet|null> {
        return await FurmeetModel.findOne({
            userId: userId,
        });
    }
    
    public async createUser(user: Furmeet ): Promise<Furmeet> {
        return await FurmeetModel.create(user);
    }
    
    public async getUsersByState( state : string ):  Promise<Array<Furmeet>>{
        return await FurmeetModel.find({
            state: state
        });
    }
    
    public async updateUserState( _id : Types._ObjectId, state : string ):  Promise<boolean>{
        await FurmeetModel.updateOne( { _id },{
            state: state
        });
        return true;
    }
    
}