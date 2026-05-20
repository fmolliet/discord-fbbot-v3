import { CacheType, ChannelType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../interfaces";
import { Logger as LOG } from "../helpers";
import PermissionUtils from "../utils/PermissionUtils";

export default class InteractionHandler {
    public async handle(command: Command, interaction: ChatInputCommandInteraction<CacheType>){
        const startTime = performance.now();
        if ( !command.hasSlashSupport ){
            interaction.reply(`O comando \`/${command.name}\` não tem suporte para \`/\``);
            return;
        }
        
        if (command.privateOnly && interaction.channel?.type !== ChannelType.DM) {
            LOG.warn(`Comando: ${command.name.toUpperCase()} somente DM.`);
            interaction.reply("Esse comando somente pode ser executado no pv!");
            return;
        }
        
        if (command.adminOnly) {
            const isAdmin = await PermissionUtils.checkAdminPermission(interaction.user.id, interaction.guild);
            if (!isAdmin) {
                LOG.warn(`Comando: ${command.name.toUpperCase()} somente para adminstradores.`);
                interaction.reply("Somente administradores podem utilizar esse comando!");
                return;
            }
        }
      
        
        LOG.info("Comando a se executado: " + command.name.toUpperCase());
        if (command.slash) {
            command.slash(interaction);
        }
        const endTime = performance.now();
        LOG.debug(`Execution time: ${(endTime - startTime).toFixed(3)} ms`);
    }
}