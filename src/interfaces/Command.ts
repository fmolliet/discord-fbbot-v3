import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import { CommandParams } from './CommandParams';

export interface Command {
    name: string
    description: string
    dm_permission?: boolean
    aliases?: Array<string> 
    hasArgs?: boolean
    guildOnly?: boolean
    adminOnly?: boolean
    ownerOnly ?: boolean
    privateOnly ?: boolean
    usage?: string
    cooldown?: number
    channelId ?: string
    hasMention ?: boolean
    hasAttachment ?: boolean
    hasSlashSupport?: boolean
    slash ?: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
    data?: SlashCommandBuilder
    execute( param : CommandParams): Promise<Message|Message[]|void>
}