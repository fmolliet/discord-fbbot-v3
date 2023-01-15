import { Client, Collection, Message} from 'discord.js';
import FurmeetRepository from '../repositories/FurmeetRepository';
import TaskRepository from '../repositories/TaskRepository';
import WarnRepository from '../repositories/WarnRepository';
import TwitterService from '../services/TwitterService';
import Command from './Command';

export interface CommandParams {
    message: Message
    args?: Array<string>
    commands?: Collection<string, Command>
    client ?: Client
    setPrefix ?: (prefix:string) => void
    furmeetRepository ?: FurmeetRepository
    taskRepository ?: TaskRepository
    warnRepository ?: WarnRepository
}