import { Client, Collection, Message} from 'discord.js';
import FurmeetRepository from '../repositories/FurmeetRepository';
import Command from './Command';

export interface CommandParams {
    message: Message,
    args?: Array<string>,
    commands?: Collection<string, Command>,
    client ?: Client,
    furmeetRepository ?: FurmeetRepository
}