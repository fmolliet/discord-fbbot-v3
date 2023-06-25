import { Types } from 'mongoose';

import SettingModel from '../models/Settings';
import { Setting } from '../interfaces';

export default class SettingRepository {
    
    public async getSettingByName( name: string ): Promise<Setting|null> {
        return SettingModel.findOne({
            name: name,
        });
    }
    
    public async createSetting(setting: Setting ): Promise<Setting> {
        return await SettingModel.create(setting);
    }

    public async updateSettingValue( _id : Types._ObjectId, value : string ):  Promise<boolean>{
        SettingModel.updateOne( { _id },{
            state: value
        });
        return true;
    }
}