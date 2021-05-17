export interface Command {
    name: string
    description: string
    aliases?: Array<string> 
    args?: boolean
    guildOnly?: boolean
    adminOnly?: boolean
    usage?: string
    cooldown?: number
    channelId ?: string
    execute(message: Message,  args?: Array<string>, commands?: Collection<string, this>): void
}