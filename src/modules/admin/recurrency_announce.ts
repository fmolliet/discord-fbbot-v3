import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, CommandParams } from "../../interfaces";
import service from "../../services/AnnounceService";
import { Logger } from '../../helpers';

const command : Command = {
    name: 'cadastrar-anuncio',
    description: 'Cadastra anuncio para um canal específico',
    guildOnly: true,
    adminOnly: true,
    hasSlashSupport: true,
    dm_permission: false,
    async slash(interaction){
        const modal = new ModalBuilder().setCustomId("cadastrar-anuncio").setTitle("Cadastro de anuncio")
        
        const channelIdInput = new TextInputBuilder()
			.setCustomId('channelId')
            .setPlaceholder("Cole o ID do canal")
		    // The label is the prompt the user sees for this input
			.setLabel("Qual o canal que deverá ser anunciado?")
            .setRequired(true)
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);
            
        const messageInput = new TextInputBuilder()
			.setCustomId('message')
			.setLabel("Qual a mensagem que deverá ser mandada?")
            .setRequired(true)
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);
            
        const frequency = new TextInputBuilder()
			.setCustomId('frequency')
			.setLabel("Qual será a frequencia do anuncio?")
            .setRequired(true)
            .setPlaceholder("semanal, mensal, bimestral, trimestral, semestral")
			.setStyle(TextInputStyle.Short);    
            
           
        const firstActionRow =  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(channelIdInput);
        const secondActionRow =  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput);
        const thridActionRow =  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(frequency);
        
            
        modal.addComponents(firstActionRow, secondActionRow,thridActionRow);
        
        interaction.showModal(modal)
    },
    async handleModalSubmit(interaction){
        const channelId = interaction.fields.getTextInputValue('channelId');
        const message = interaction.fields.getTextInputValue('message');
        const frequency = interaction.fields.getTextInputValue('frequency');
        Logger.info(`[MODAL] Recebido: ${channelId} ${message} ${frequency}`)
        await service.createAnnounce({message, channelId, frequency, lastPosted: new Date()})
        await interaction.reply({ content: 'Seu anuncio foi cadastrado com sucesso!' });
    },
    async execute({message } : CommandParams){
        await message.reply("Use o comando via `/`");
    }
}


export = command;