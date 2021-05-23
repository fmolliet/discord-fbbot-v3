/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageEmbed } from 'discord.js';
import { RULES } from '../../configs/rules';
import { Logger } from '../../helpers';
import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'warn',
    description: 'Da warn nos membros',
    guildOnly: true,
    adminOnly: true,
    hasMention: true,
    async execute({message, args, taskRepository, warnRepository } : CommandParams){

        if ( ! args![1] ) { // Verifica se tem o motivo do warn
            return message.reply('está faltando informar o motivo');
        }
        
        const muteRoleId = process.env.NODE_ENV === 'dev'? '845850171975139328' : RULES.muteRoleId;
        const time = process.env.NODE_ENV === 'dev'? 60 : (24*60*60);
        
        const mentionedUser = message.mentions.users.first();
        const userId = mentionedUser?.id || args![0];
        // Mute
        const muteTime = 1000 * time;/* */
        const removeAt = new Date(Date.now() + muteTime) ;
        
        // Grava tarefa no banco
        if ( message.guild?.member(userId) ){
            
            const member = message.guild?.member(userId);
            // Adiciona o warn
            console.log(args?.shift());
            if( args?.length === 0 ) {
                return message.reply('você precisa dar um motivo!');
            }
            
            const description = args?.join(' ') || '';
            
            await warnRepository?.createWarn({description: description, userId: member?.id, guildId: message.guild.id, createdAt: new Date(Date.now()) });
            
            // Conta quantos warns a pessoa ja tomou para atribuir puniÇão
            const warns = await warnRepository?.getWarnsByUserId(member?.id);
            let punicao = '';
            // Se foi menos que 3 warns ele irá mutar
            if (warns!.length < 3 ) {
            
                const role = message.guild.roles.cache.get(muteRoleId);
                
                if ( !role ) {
                    return message.reply('Não tem tag de `Mutado` no servidor');
                }
                // Mute tag
                try {
                    member?.roles.add(role);
                } catch ( err ){
                    message.channel.send('Não consegui adicionar a rolede mute desse cara!');
                }
                const task = await taskRepository?.createTask({ guildId: message.guild.id, userId: member?.id, executeOn: removeAt});
                
                setTimeout( async()=> {
                    try {
                        member?.roles.remove(role);
                    } catch ( err ){
                        message.channel.send('Não consegui remover a rolede mute desse cara!');
                    }
                    
                    await taskRepository?.deleteTask(task!);
                },muteTime);
                
                punicao = 'Mute';
                // Feedback do comando para staff
                message.reply('warn aplicado, o membro foi punido com mute!');
            } else if ( warns!.length === 3 ){
                // Kicka e retorna mensagem para dm
                punicao = 'Kick';
                try{
                    member?.kick('Kickado por ter tomado warning demais');
                    // Feedback do comando para staff
                    message.reply('warn aplicado, o membro foi punido com Kick!');
                } catch ( err ){
                    Logger.error(err.message);
                    message.reply('ouve um erro na execução do kick, provavelmente estou sem permissão!');
                }
           
            } else {
                // Bane o membro e manda mensagem no PV  
                punicao = 'Ban';
                try{
                    member?.ban({reason: 'Tomou 4 warnings ¯\\_(ツ)_/¯'});   
                    message.reply('warn aplicado, o membro foi punido com Ban!');
                } catch ( err ){
                    Logger.error(err.message);
                    message.reply('ouve um erro na execução do ban, provavelmente estou sem permissão!');
                }
               
            }
            
            // Manda mensagem no pv
            return member?.send( new MessageEmbed({
                title: `Você recebeu o seu ${warns!.length}º warning! `,
                color: '#FF0000',
                fields: [
                    { name: 'Motivo:', value: description },
                    { name: 'Punição:', value: punicao, inline: true}
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Furry Brasil 2.0'
                }              
            }));
        }
        return  message.reply(`membro \`${userId}\` não localizado!`);
    }
};

export = command;