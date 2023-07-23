/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import isValidState from '../../utils/validateState';

import meetingService from "../../services/MeetingService";
import { Logger } from '../../helpers';
import { Message } from 'discord.js';

const command : Command = {
    name: 'local',
    description: 'Cadastra ou atualiza seu local de Meetings!',
    usage: '[UF]',
    guildOnly: true,
    channelId: '376518334679613440',
    cooldown: 5,
    hasArgs: true,
    async execute( { message, args } : CommandParams){
        const state = args![0].toUpperCase();
        if( isValidState(state) ){
            const data = await meetingService.getBySnowflake(message.author.id);
            return await updateMeetingState(message, data, state);
        }
        return message.reply(`Estado Inválido: \`' + ${args![0]} + '\` tente outro!'`);

    }
};

// Função para atualizar o estado do usuário
async function updateMeetingState(message: Message, data: any, state: string) {
  if (data && data.state === state) {
    Logger.info("Usuário localizado, mesmo estado para: " + data.name + " " + data.snowflake);
    return message.reply('Você já está cadastrado nesse estado!');
  } else if (data) {
    Logger.info("Usuário localizado, alterando estado para: " + data.name + " " + data.snowflake);
    await meetingService.update(message.author.username, data.snowflake, state);
    return message.reply('Eu acabei de atualizar seu cadastro no Furmeet!');
  }

  await createMeetingRecord(message, state);
}

// Função para criar um novo registro de reunião para o usuário
async function createMeetingRecord(message: Message, state: string) {
  await meetingService.create(message.author.username, message.author.id,state);

  return message.reply('Cadastrei você no Furmeet!');
}

export = command;