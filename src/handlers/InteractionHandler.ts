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
        
        if (
            command.adminOnly &&
            !(await interaction.guild?.members.fetch(interaction.member!.user.id))?.permissions.has(
              "Administrator"
            ) &&
            !(await interaction.guild?.members.fetch(interaction.member!.user.id))?.permissions.has(
              "KickMembers"
            )
          ) {
            LOG.warn(`Comando: ${command.name.toUpperCase()} somente para adminstradores.`);
            interaction.reply("Somente administradores podem utilizar esse comando!");
            return;
          }
      
        
        LOG.info("Comando a se executado: " + command.name.toUpperCase());
        command.slash!(interaction);
        const endTime = performance.now();
        LOG.debug(`Execution time: ${(endTime - startTime).toFixed(3)} ms`);
    }
}