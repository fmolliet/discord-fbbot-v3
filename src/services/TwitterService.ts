
import axios, { AxiosInstance } from "axios";
import getTwitterHeaderOauth10a from '../utils/getTwitterHeaderOauth10a';
import { Logger } from '../helpers';
//@Service()
class TwitterService {
    
    client : AxiosInstance;
    
    private twitterDomain : string = 'https://api.twitter.com';
    
    constructor(){
        this.client = axios.create({
            baseURL: this.twitterDomain
        });
    }
    
    async tweet(data: string){
        
        const oauthHeader = await getTwitterHeaderOauth10a();
        
        await this.client.post("/2/tweets", {text: data} , {
            headers:{
                Authorization: oauthHeader
            }
        })
        Logger.info('Post realizado no twitter com sucesso!')
    }
}

export default TwitterService;