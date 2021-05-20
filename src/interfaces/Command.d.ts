import { CommandParams } from './CommandParams';

export interface Command {
    name: string
    description: string
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
    execute( param : CommandParams): void
}