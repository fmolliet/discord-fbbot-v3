import { Client, Collection, Message} from 'discord.js';
import UserRepository from '../repositories/UserRepository';
import Command from './Command';

export interface CommandParams {
    message: Message,
    args?: Array<string>,
    commands?: Collection<string, Command>,
    client ?: Client,
    userRepository ?: UserRepository
}