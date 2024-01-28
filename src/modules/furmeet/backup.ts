/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosError } from 'axios';
import { Message, MessagePayload, AttachmentBuilder } from 'discord.js';
import { Logger } from '../../helpers';
import createReport from '../../helpers/reporter';
import { Command, CommandParams, CreatedReporter } from '../../interfaces';

import cacheRepository from '../../repositories/CacheRepository';
import meetingService from "../../services/MeetingService";

const command: Command = {
    name: 'backup',
    description: 'Realiza o backup do furmeet para a staff!',
    usage: '[birthday|furmeet]',
    hasArgs: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 120,
    async execute({ message , args }: CommandParams) : Promise<Message[]|Message>  {
        const type = args![0]?.toUpperCase();
    
        if (!isValidType(type)) {
            return message.reply(`Tipo inválido: '${args![0]}', escolha entre birthday e furmeet!`);
        }

        const report : CreatedReporter  = await createReport();

        const furs = await meetingService.getActiveFurs();
        
        if (furs.length === 0) {
            return message.reply('Infelizmente, não achei ninguem nesse estado para avisar do me-p[et!');  
        }

        message.channel.send('Montando backup...');
        await fillReport(message, report, furs);
        message.reply('Estarei enviando em seu privado o arquivo de backup!');
        
        report.workbook.commit().then(function() {
            Logger.info('Backup executado com sucesso!');
        });
            
        return (await message.author.createDM()).send(
            new MessagePayload(
                await message.author.createDM(), { 
                    content: 'Segue backup de Furmeet, abraços.',
                    files: [new AttachmentBuilder(report.filename, { name: 'report.xlsx'})]
                }
            )
        );
    }
};

function isValidType( type: string ){
    return type === "BIRTHDAY" || type === "FURMEET";
}


async function fillReport(message: Message, report: CreatedReporter, furs: any[]) {
    const promises = furs.map(async (fur: any) => {
        try {
            const furName = fur.name || fur.name!="" ? fur.name : await cacheRepository.getNameOfSnowflake(message,fur.snowflake);
            if (furName) {
                report.worksheet.addRow({state: fur.state,userId: fur.snowflake, name: furName }).commit()
            }
        } catch (err){
            Logger.warn(`Não localizado nesse server: ${fur.snowflake}`);
            try {
                if (process.env.ENVIRONMENT == "prod"){
                    Logger.warn("Deactivating fur snowflake from db.")
                    await meetingService.deactive(fur.id);
                }
            } catch ( ex: unknown | AxiosError){
                if (axios.isAxiosError(ex)){
                    Logger.error(`Erro ao tentar desativar: ${ex.message}`)
                }
            }
        }
    });
    await Promise.all(promises);
}



export = command;