import axios, { AxiosResponse } from "axios";
import { BirthDay } from "../interfaces";

const api = axios.create({
    baseURL: process.env.BIRTHDAY_BASEURL,
    auth: {
        username: process.env.BIRTHDAY_USERNAME ?? "",
        password: process.env.BIRTHDAY_PASSWORD ?? ""
    }
});



class BirthdayService {
    async getBirtyhday(): Promise<Array<Announce>>{
        const { data } = await api.get("/anuncios");
        return data || [];
    }
    
    async getBirthDaysById(id: string): Promise<AxiosResponse<BirthDay>>{
        return await api.get(`/birthday/${id}`);
    }
    
    async getBirthDaysFromToday(): Promise<BirthDay[]>{
        const { data } = await api.get(`/birthday/today`);
        return data || [];
    }
    
    async getBirthDaysFromMonth(): Promise<AxiosResponse<BirthDay[]>>{
        const { data } = await api.get(`/birthday/month`);
        return data || [];
    }
    
    async createBirthday(birthday: BirthDay): Promise<void>{
        await api.post("/birthday", birthday);
    }
    
    async updateBirthDay(birthday: BirthDay): Promise<BirthDay>{
        return await api.patch(`/birthday`, birthday);
    }
    
    async deleteBirthDay(id: string): Promise<void>{
        await api.delete(`/birthday/${id}`);
    }
}

export default  new BirthdayService();