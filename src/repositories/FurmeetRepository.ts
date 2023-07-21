import { Types, UpdateWriteOpResult } from 'mongoose';
import { Snowflake } from 'discord.js';

import FurmeetModel from '../models/Furmeets';
import { Furmeet } from '../interfaces';
import {ObjectID} from 'mongodb';

export default class FurmeetRepository {
    
    public async getUserById( userId: Snowflake ): Promise<Furmeet|null> {
        return FurmeetModel.findOne({
            userId: userId,
        });
    }
    
    public async createUser(user: Furmeet ): Promise<Furmeet> {
        return await FurmeetModel.create(user);
    }
    
    public async getUsersByState( state : string ):  Promise<Array<Furmeet>>{
        return FurmeetModel.find({
            state: state
        });
    }
    
    public async getAllUsers(): Promise<Array<Furmeet>> {
        return FurmeetModel.find({ active: true});
    }
    
    public async updateUserState( _id : Types.ObjectId, state : string ):  Promise<boolean>{
        FurmeetModel.updateOne( { _id },{
            state: state,
            active: true
        });
        return true;
    }
    
    public async deactive(  user: Furmeet ): Promise<void> {
        // Deleção fisica
        //FurmeetModel.deleteOne(user); 
        // Deleção lógica
        //user.active = false;
        //await FurmeetModel.create(user); 
    }
    
    public deleteBySnowflake( snowflake: Snowflake ): void {
        FurmeetModel.deleteOne({snowflake}); 
    }
    
}