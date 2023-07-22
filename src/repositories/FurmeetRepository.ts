import { Types } from 'mongoose';
import { Snowflake } from 'discord.js';

import FurmeetModel from '../models/Furmeets';
import { Furmeet } from '../interfaces';

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
        return FurmeetModel.find();
    }
    
    public async setUserActive( _id : Types.ObjectId ):  Promise<boolean>{
        await FurmeetModel.updateOne( { _id },{
            active: true
        });
        return true;
    }
    
    public async updateUserState( _id : Types.ObjectId, state : string ):  Promise<boolean>{
        await FurmeetModel.updateOne( { _id },{
            state: state,
            active: true
        });
        return true;
    }
    
    public async deactive(  _id: Types.ObjectId ): Promise<void> {
        // Deleção fisica
        //FurmeetModel.deleteOne(   user); 
        // Deleção lógica
        await FurmeetModel.updateOne( { _id },{
            active: false
        });
    }
    
    public deleteBySnowflake( snowflake: Snowflake ): void {
        FurmeetModel.deleteOne({snowflake}); 
    }
    
}