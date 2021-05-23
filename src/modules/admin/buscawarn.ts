/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageEmbed } from 'discord.js';
import { RULES } from '../../configs/rules';
import { Logger } from '../../helpers';
import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'buscawarn',
    aliases: ['traswarns', 'buscawarns', 'getwarns'],
    description: 'Da warn nos membros',
    usage: '[Mention ou Id]',
    guildOnly: true,
    adminOnly: true,
    hasMention: true,
    async execute({message, args, warnRepository } : CommandParams){
        
        const mentionedUser = message.mentions.users.first();
        const userId = mentionedUser?.id || args![0];

        // Grava tarefa no banco
        if ( message.guild?.member(userId) ){
          
            const member = message.guild?.member(userId);
            
            const messageEmbed = new MessageEmbed({
                title: `Warns do ${member?.displayName}`,
                description: 'Abaixo estão os warns recebidos pelo usuário.',
                color: message.guild?.member(message.author.id)?.displayHexColor as string,
                timestamp: new Date(),
                footer: {
                    text: 'Furry Brasil 2.0'
                }  
            });
            
            const warns = await warnRepository?.getWarnsByUserId(member?.id);
            
            warns?.map(( warn, index )=>{
                messageEmbed.addField(
                    `${index +1}º Motivo:`, 
                    `${warn?.description}\n***Recebido em***:\n${warn?.createdAt.getDate()}/${(warn?.createdAt.getMonth() ||0) + 1}/${warn?.createdAt.getFullYear()} ás ${warn?.createdAt.getHours()}:${warn?.createdAt.getMinutes()}`,
                    false
                );
            });
            
            if ( warns!.length < 1){
                messageEmbed.setDescription('Não recebeu nenhum warn ainda.');
            }
            
            return message.reply(messageEmbed);
        }
        return  message.reply(`membro \`${userId}\` não localizado!`);
    }
    
};

export = command;