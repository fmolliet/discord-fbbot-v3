import { Types } from 'mongoose';
import { Snowflake } from 'discord.js';

import FurmeetModel from '../models/Furmeets';
import { Furmeet } from '../interfaces';

export default class FurmeetRepository {
    
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
    
    public async getAllUsers(): Promise<Array<Furmeet>> {
        return await FurmeetModel.find();
    }
    
    public async updateUserState( _id : Types.ObjectId, state : string ):  Promise<boolean>{
        await FurmeetModel.updateOne( { _id },{
            state: state
        });
        return true;
    }
    
}