import { Message } from "discord.js";

export default function isFromBotOrWebhook( message: Message): boolean {
    return message.author.bot || message.webhookId != null;
}