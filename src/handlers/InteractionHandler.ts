import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../interfaces";
import { Logger as LOG } from "../helpers";
export default class InteractionHandler {
    public async handle(command: Command, interaction: ChatInputCommandInteraction<CacheType>){
        const startTime = performance.now();
        if ( !command.hasSlashSupport ){
            interaction.reply(`O comando \`/${command.name}\` não tem suporte para \`/\``);
        }
        command.slash!(interaction);
        const endTime = performance.now();
        LOG.info(`Execution time: ${(endTime - startTime).toFixed(3)} ms`);
    }
}