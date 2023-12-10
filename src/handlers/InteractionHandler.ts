import { CacheType, ChannelType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../interfaces";
import { Logger as LOG } from "../helpers";
export default class InteractionHandler {
    public async handle(command: Command, interaction: ChatInputCommandInteraction<CacheType>){
        const startTime = performance.now();
        if ( !command.hasSlashSupport ){
            interaction.reply(`O comando \`/${command.name}\` não tem suporte para \`/\``);
            return;
        }
        
        if (command.privateOnly && interaction.channel!.type !== ChannelType.DM) {
            LOG.warn(`Comando: ${command.name.toUpperCase()} somente DM.`);
            interaction.reply("Esse comando somente pode ser executado no pv!");
            return;
        }
        
        LOG.info("Comando a se executado: " + command.name.toUpperCase());
        command.slash!(interaction);
        const endTime = performance.now();
        LOG.debug(`Execution time: ${(endTime - startTime).toFixed(3)} ms`);
    }
}