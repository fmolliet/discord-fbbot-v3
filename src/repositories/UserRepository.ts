import { Types } from 'mongoose';
import { Snowflake } from 'discord.js';

import FurmeetModel from '../models/UserFurmeet';
import { Furmeet } from '../interfaces';

export default class UserRepository {
    
    public async getUserById( userId: Snowflake ): Promise<Furmeet | null> {
        return FurmeetModel.findOne({
            userId: userId,
        });
    }
    
    public async createUser(user: Furmeet): Promise<Furmeet> {
        return FurmeetModel.create(user);
    }
}