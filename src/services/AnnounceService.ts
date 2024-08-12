import axios from "axios";

const api = axios.create({
    baseURL: process.env.ANNOUNCES_BASEURL,
});

class AnnounceService {
    async getAnnounces(): Promise<Array<Announce>>{
        const { data } = await api.get("/anuncios");
        return data || [];
    }
    
    async getAnnounceById(id: string): Promise<Announce>{
        const { data } = await api.get(`/anuncios/${id}`);
        return data;
    }
    
    async createAnnounce(announce: Announce): Promise<void>{
        await api.post("/anuncios", announce);
    }
    
    async updateAnnounce(announce: Announce): Promise<Announce>{
        return await api.put(`/anuncios/${announce._id}`, announce);
    }
    
    async deleteAnnounce(id: string): Promise<void>{
        await api.delete(`/anuncios/${id}`);
    }
}

export default new AnnounceService();