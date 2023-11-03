import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces";

export default class InteractionHandler {
    public async handle(command: Command, interaction: ChatInputCommandInteraction<CacheType>){
        if ( !command.hasSlashSupport ){
            interaction.reply(`O comando \`/${command.name}\` não tem suporte para \`/\``);
        }
        command.slash!(interaction);
    }
}