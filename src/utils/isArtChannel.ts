import { CONSTANTS } from "../configs/Constants";

export default function isArtChannel(channelId: string): boolean{
    return CONSTANTS.artChannelId.indexOf(channelId)>=0;
}