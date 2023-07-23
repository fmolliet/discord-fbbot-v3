import axios from "axios";

const api = axios.create({
    baseURL: process.env.MEETING_BASEURL,
});

class MeetingService {
    
    async getActiveFurs() {
        const { data } = await api.get(`/meeting`);
        return data.content || [];
    }
    
    async getBySnowflake(snowflake: string){
        const { data } = await api.get(`/meeting/${snowflake}`)
        return data;
    }
    
    async getFursByState(state: string) {
        const { data } = await api.get(`/meeting/state/${state}`);
        return data.content || [];
    }
    
    async create(name: string, snowflake: string, state:string ){
        await api.post(`/meeting`, {name, snowflake, state, active: true});
    }
    
    async update( name: string, snowflake: string, state:string ){
        await api.put(`/meeting`, {name, snowflake, state});
    }
    
    async deactive(snowflake: string){
        await api.delete(`/meeting/${snowflake}`);
    }
}

export default new MeetingService();