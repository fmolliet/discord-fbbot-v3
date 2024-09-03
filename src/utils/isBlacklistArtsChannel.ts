import { Message } from "discord.js";
import isArtChannel from "./isArtChannel";
import isImage from "./isImage";
import containsSocialMediaLink from "./containsSocialMediaLink";

export default function isBlacklistArtsChannel( message: Message) {
    if(!isArtChannel(message.channelId)) {
      return false;
    }
    if ((message.attachments.size <= 0 && !containsSocialMediaLink(message.content)) || (message.attachments.size>0 && !isImage(message.attachments.first()?.url!))){
      return true;
    }
    return false;
}