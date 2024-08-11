import { Message } from "discord.js";
import containsTwitterLink from "./ContainsTwitterUrl";
import isArtChannel from "./isArtChannel";
import isImage from "./isImage";

export default function isBlacklistArtsChannel( message: Message) {
    if(!isArtChannel(message.channelId)) {
      return false;
    }
    if ((message.attachments.size <= 0 && !containsTwitterLink(message.content)) || (message.attachments.size>0 && !isImage(message.attachments.first()?.url!))){
      return true;
    }
    return false;
}