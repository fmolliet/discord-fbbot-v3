import { Client, Collection, Message} from 'discord.js';
import Command from './Command';

export interface CommandParams {
    message: Message,
    args?: Array<string>,
    commands?: Collection<string, Command>,
    client ?: Client
}