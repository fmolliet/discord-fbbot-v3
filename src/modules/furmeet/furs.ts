/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import { Logger } from '../../helpers';
import cacheRepository from '../../repositories/CacheRepository';
import isValidState from '../../utils/validateState';

import meetingService from "../../services/MeetingService";
import { Message } from 'discord.js';
import axios, { AxiosError } from 'axios';

const command : Command = {
    name: 'fur',
    aliases: ['furs', 'furros'],
    description: 'Lista todos furries de um estado!',
    usage: '[UF]',
    guildOnly: true,
    channelId: '376518334679613440',
    cooldown: 5,
    hasArgs: true,
    async execute( { message, args } : CommandParams) {
        const state = args![0]?.toUpperCase();

        if (!isValidState(state)) {
            return message.reply(`Estado inválido: '${args![0]}'!`);
        }

        const furs = await meetingService.getFursByState(state);

        if (furs.length === 0) {
            return message.reply('Infelizmente não achei ninguém nesse estado!');
        }

        const founded = await getFurNames(message, furs);

        if (founded.length >= 1) {
            message.channel.send('Localizei uma galera! Aqui a lista com os nomes:');
            return message.channel.send(`\`\`\`${founded.join('\n')}\`\`\``);
        }
     
    }
};

async function getFurNames(message: Message, furs: any[]) {
    const founded: string[] = [];
    const promises = furs.map(async (fur: any) => {
        try {
            const furName = fur.name || fur.name!="" ? fur.name : await cacheRepository.getNameOfSnowflake(message, fur.snowflake);
            if (furName) {
                founded.push(furName);
            }
        } catch (err) {
            Logger.error(`Error para snowflake ${fur.snowflake}: ${err}.`);
            try {
                await meetingService.deactive(fur.snowflake);
            } catch ( ex: unknown | AxiosError){
                if (axios.isAxiosError(ex)){
                    Logger.error(`Erro ao tentar desativar: ${ex.message}`)
                }
            }
            
        }
    });
    await Promise.all(promises);
    return founded;
}


export = command;