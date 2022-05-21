import { TwitterApi } from 'twitter-api-v2';
//@Service()
class TwitterService {
    
    client : TwitterApi;
    
    private consumerKey     : string = process.env.TWITTER_CONSUMER_KEY        || ''
    private consumerSecret   : string = process.env.TWITTER_CONSUMER_SECRET    || ''
    private accessToken     : string = process.env.TWITTER_ACCESS_TOKEN        || ''
    private accessSecret    : string = process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
    private bearerToken     : string = process.env.TWITTER_BEARER_TOKEN        || ''
    
    constructor(){
        this.client = new TwitterApi({
            appKey: this.consumerKey,
            appSecret: this.consumerSecret,
            accessToken: this.accessToken,
            accessSecret: this.accessSecret
        });
    }
    
    async tweet(data: string){
        return this.client.v2.tweet(data);
    }
}

export default TwitterService;