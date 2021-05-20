import { Types } from 'mongoose';

import SettingModel from '../models/Settings';
import { Setting } from '../interfaces';

export default class SettingRepository {
    
    public async getSettingByName( name: string ): Promise<Setting|null> {
        return await SettingModel.findOne({
            name: name,
        });
    }
    
    public async createSetting(setting: Setting ): Promise<Setting> {
        return await SettingModel.create(setting);
    }

    public async updateSettingValue( _id : Types._ObjectId, value : string ):  Promise<boolean>{
        await SettingModel.updateOne( { _id },{
            state: value
        });
        return true;
    }
}