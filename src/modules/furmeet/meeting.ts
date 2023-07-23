/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Logger } from '../../helpers';
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';

import meetingService from "../../services/MeetingService";
import cacheRepository from '../../repositories/CacheRepository';
import { Message } from 'discord.js';

const command : Command = {
    name: 'meeting',
    description: 'Faz um meeting e marca todos da UF!',
    usage: '[UF] [Staff ou mention ou contato ] [Informações sobre o evento]',
    hasArgs: true,
    async execute( { message, args } : CommandParams){
        const state = args![0]?.toUpperCase();

        if (!validateState(state)) {
            return message.reply(`Estado Inválido: '${args![0]}' tente outro!`);
        }
        
        const organizer =  message.mentions.users.first()?.username ?? args![1] ;

        if(args?.length === 0) {
            return message.channel.send('Nenhuma informação foi dada sobre o meet :/');
        }

        const furs = await getFursByState(state);
        
        if (furs.length === 0) {
            return message.reply('Infelizmente, não achei ninguem nesse estado para avisar do meet!');  
        }
       
        const founded = await getFurMentions(message, furs);
        
        if (founded.length >= 1) {
            const mensagem = `Furmeet em **${state} pessoal!**\n${founded}\nOrganizado por: **${organizer}**\nSobre o evento: ${args!.join(' ')}`;
            return message.channel.send(mensagem);
        }
    }
};

async function getFursByState(state: string) {
    const { data } = await meetingService.get(`/meeting/state/${state}`);
    return data.content || [];
}

async function getFurMentions(message: Message, furs: any[]) {
    let founded: string = "";
    const promises = furs.map(async (fur: any) => {
        try {
            const cachedName = await cacheRepository.get(fur.snowflake);

            if (cachedName) {
                founded += `<@${fur.snowflake}> `;
            } else {
                const furMember = await message.guild?.members.fetch(fur.snowflake);
                const furName = furMember?.displayName;

                if (furName) {
                    cacheRepository.insert(fur.snowflake, furName);
                    founded += `<@${fur.snowflake}> `;
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