import WarnModel from '../models/Warn';
import { Warn } from '../interfaces';
import { Snowflake } from 'discord.js';

class WarnRepository {
    
    public async getWarnsByUserId( userId: string | Snowflake | undefined ): Promise<Array<Warn|null>> {
        return WarnModel.find({
            userId
        });
    }
    
    public async createWarn(warn: Warn ): Promise<Warn> {
        return await WarnModel.create(warn);
    }
    
    public async deleteTask( warn: Warn ): Promise<void> {
        WarnModel.deleteOne(warn);
    }
}

export default new WarnRepository();