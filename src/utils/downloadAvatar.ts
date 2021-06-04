import fs    from 'fs';
import axios from 'axios';

export default async function avatarDownloader(url : string, path = './temp/img.png'): Promise<string> {
    return ( axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise( (resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(path))
                    .on('finish', () => resolve(path))
                    .on('error', ( e : Error ) => reject(e));
            }),
    )
    );
}             