import isimage from 'is-image';

export default function isImage(url: string){
    return isimage(url.substring(0,url.indexOf("?")));
}