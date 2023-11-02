import {
    ClientOptions,
    InfluxDB,
    WriteApi,
    Point
} from '@influxdata/influxdb-client';

//@Service()
class InfluxService {
    
    private url     : string = process.env.INFLUX_HOST ?? 'http://localhost:8086'
    private token   : string = process.env.INFLUX_TOKEN ?? ''
    
    private org     : string = process.env.INFLUX_ORG    ?? 'test'
    private bucket  : string = process.env.INFLUX_BUCKET ?? 'dev'
    
    private appname : string = process.env.INFLUX_APP ?? 'local'
    
    private client  : InfluxDB;
    
    private configuration: ClientOptions = {
        url: this.url,
        token:  this.token
    };
    
    private writeApi : WriteApi;

    constructor (){
        this.client   =  new InfluxDB(this.configuration);
        this.writeApi = this.client.getWriteApi(this.org, this.bucket);
        this.writeApi.useDefaultTags({host: this.appname});
    }
    
    write( measurementName: string, value: any ){
        
        const point = new Point(measurementName);
        
        switch( typeof value ){
            case 'number':
                point.intField(value.toString(), 1);
                break;
            case 'string':
                point.intField(value, 1);
                break;
            default:
                break;
        }
        
        this.writeApi.writePoint(
            point
        );
        this.writeApi
            .flush()
            .then(() => {
                console.log('')
            })
            .catch(e => {
                console.error(e)
                //console.log('\\nFinished ERROR')
            });
    }
}

export default new InfluxService();