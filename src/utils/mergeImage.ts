import images from 'images';

export default async function mergeImages(img: string, extra = './resources/pride/bi_flag.png', authorId : string ): Promise<string>{

    return  new Promise( (resolve, reject) => {
        const path = `./temp/pride/${authorId}.png`;
        images(img)
            .size(2048)
            .draw( images(extra).size(2048), 0, 0 )
            .saveAsync(path, (err)=>{
                if (err) {
                    reject(err);
                }
                resolve(path);
            });
    });
}             