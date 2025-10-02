/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosError } from 'axios';
import { Message, MessagePayload, AttachmentBuilder } from 'discord.js';
import { Logger } from '../../helpers';
import { createBirthDayReport, createMeetReport } from '../../helpers/reporter';
import { BirthDay, Command, CommandParams, CreatedReporter } from '../../interfaces';

import cacheRepository from '../../repositories/CacheRepository';
import meetingService from "../../services/MeetingService";
import BirthdayService from '../../services/BirthdayService';

const command: Command = {
    name: 'backup',
    description: 'Realiza o backup do furmeet para a staff!',
    usage: '[birthday|furmeet]',
    hasArgs: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 120,
    async execute({ message , args }: CommandParams) : Promise<Message[]|Message>  {
        if (!args || args.length === 0) {
            return message.reply("Você deve especificar o tipo de backup: 'birthday' ou 'furmeet'.");
        }
        const type = args[0]?.toUpperCase();
    
        if (!isValidType(type)) {
            return message.reply(`Tipo inválido: '${args![0]}', escolha entre birthday e furmeet!`);
        }
        await message.channel.send('Montando backup...');
        let report : CreatedReporter;
        if (type === "BIRTHDAY") {
            report= await createBirthDayReport();
            const birthdays = await BirthdayService.getBirthdays();
            if (birthdays.length === 0) {
                return message.reply('Infelizmente, não achei ninguem cadastrado para gerar o backup!');  
            }
            await fillBirthdayReport(message, report, birthdays);
        } else {
            report= await createMeetReport();
            const furs = await meetingService.getActiveFurs();
            if (furs.length === 0) {
                return message.reply('Infelizmente, não achei ninguem cadastrado para gerar o backup!');  
            }
            await fillReport(message, report, furs);
        }
            
        message.reply('Estarei enviando em seu privado o arquivo de backup!');
        report.workbook.commit().then(function() {
                Logger.info('Backup executado com sucesso!');
        });
        
        
            
        return (await message.author.createDM()).send(
            new MessagePayload(
                await message.author.createDM(), { 
                    content: `Segue backup do ${type}, abraços.`,
                    files: [new AttachmentBuilder(report.filename, { name: `report-${ type }-${new Date().toISOString()}.xlsx` })]
                }
            )
        );
    }
};

function isValidType( type: string ){
    return type === "BIRTHDAY" || type === "FURMEET";
}

async function fillBirthdayReport(message: Message, report: CreatedReporter, birthdays: any[]) {
    const promises = birthdays.map(async (birthday: BirthDay) => {
        try {
    
            report.worksheet.addRow({day: birthday.day, month: birthday.month, name: birthday.name, userId: birthday.snowflake }).commit()
        
        } catch (err){
            Logger.warn(`Não localizado nesse server: ${birthday.snowflake}`);
            try {
                if (process.env.ENVIRONMENT == "prod"){
                    Logger.warn("Deactivating fur snowflake from db.")
                    //await meetingService.deactive(birthday.id);
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