import { Client, Collection, Message} from 'discord.js';
import Command from './command';

export interface CommandExecuter {
    message: Message,
    args?: Array<string>,
    commands?: Collection<string, Command>,
    client ?: Client
}