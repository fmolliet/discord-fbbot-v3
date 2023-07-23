/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';
import { Logger } from '../../helpers';
import cacheRepository from '../../repositories/CacheRepository';

import meetingService from "../../services/MeetingService";
import { Message } from 'discord.js';

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

        if (!validateState(state)) {
            return message.reply(`Estado Inválido: '${args![0]}' tente outro!`);
        }

        const furs = await getFursByState(state);

        if (furs.length === 0) {
            return message.reply('Infelizmente, não achei ninguém nesse estado!');
        }

        const founded = await getFurNames(message, furs);

        if (founded.length >= 1) {
            message.channel.send('Localizei uma galera! Aqui a lista com os nomes:');
            return message.channel.send(`\`\`\`${founded.join('\n')}\`\`\``);
        }
     
    }
};

async function getFursByState(state: string) {
    const { data } = await meetingService.get(`/meeting/state/${state}`);
    return data.content || [];
}

async function getFurNames(message: Message, furs: any[]) {
    const founded: string[] = [];
    const promises = furs.map(async (fur: any) => {
        try {
            const cachedName = await cacheRepository.get(fur.snowflake);

            if (cachedName) {
                founded.push(cachedName);
            } else {
                const furMember = await message.guild?.members.fetch(fur.snowflake);
                const furName = furMember?.displayName;

                if (furName) {
                    cacheRepository.insert(fur.snowflake, furName);
                    founded.push(furName);
                }
            }
        } catch (err) {
            Logger.error(`Error para snowflake ${fur.snowflake}: ${err}.`);
            await meetingService.delete(`/meeting/${fur.snowflake}`);
        }
    });

    await Promise.all(promises);
    return founded;
}


export = command;