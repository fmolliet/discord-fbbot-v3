import images from "images";

export default async function mergeImages (img: string, extra: string = './resources/pride/bi_flag.png'): Promise<string>{

    return  new Promise( (resolve, reject) => {

        
        images(img)
            .size(2048)
            .draw( images(extra).size(2048), 0, 0 )
            .saveAsync('./temp/pride/img.png', (err)=>{
                if (err) reject(err)
                resolve('./temp/pride/img.png');
        })
        
    });
}             