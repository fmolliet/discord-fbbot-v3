/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CONSTANTS } from '../../configs/Constants';
import { Logger as LOG } from '../../helpers';
import { Command, CommandParams } from '../../interfaces';
import taskRepository from '../../repositories/TaskRepository';
import warnRepository from '../../repositories/WarnRepository';

const command : Command = {
    name: 'warn',
    description: 'Da warn nos membros',
    usage: '[Mention ou Id] [Motivo]',
    guildOnly: true,
    adminOnly: true,
    hasMention: true,
    async execute({message, args } : CommandParams){

        if ( ! args![1] ) { // Verifica se tem o motivo do warn
            return message.reply('está faltando informar o motivo');
        }
        
        const muteRoleId = process.env.NODE_ENV === 'dev'? '845850171975139328' : CONSTANTS.muteRoleId;
        const time = process.env.NODE_ENV === 'dev'? 60 : (24*60*60);
        
        const mentionedUser = message.mentions.users.first();
        const userId = mentionedUser?.id ?? args![0];
        // Mute
        const muteTime = 1000 * time;/* */
        const removeAt = new Date(Date.now() + muteTime) ;
        
        // Grava tarefa no banco
        if ( message.guild?.members.fetch(userId) ){
            
            const member = await message.guild?.members.fetch(userId);
            
            // Remove o mention
            args?.shift();
            if( args?.length === 0 ) {
                return message.reply('você precisa dar um motivo!');
            }
            
            const description = args?.join(' ') ?? '';
            // Adiciona o warn
            await warnRepository?.createWarn({description: description, userId:  member.id, guildId: message.guild.id, createdAt: new Date(Date.now()) });
            // Conta quantos warns a pessoa ja tomou para atribuir puniÇão
            const warns = await warnRepository?.getWarnsByUserId(member.id);
            let punicao = '';
            // Se foi menos que 3 warns ele irá mutar
            if (warns.length < 3 ) {
            
                const role = message.guild.roles.cache.get(muteRoleId);
                
                if ( !role ) {
                    return message.reply(`Não tem tag de \`Mutado\` com ID: \`${muteRoleId}\` no servidor ou estou sem permissão.`);
                }
                
                // Mute tag
                member?.roles.add(role).then(()=> message.reply('warn aplicado, o membro foi punido com mute!'))
                    .catch((error: { message: any })=>{
                        LOG.error(error.message);
                        message.channel.send('Não consegui adicionar a role de mute nele!');
                    });  
                            
                const task = await taskRepository?.createTask({ guildId: message.guild.id, userId: member?.id, executeOn: removeAt});
                
                setTimeout( ()=> {
                    member?.roles.remove(role)
                        .then(async()=>  taskRepository?.deleteTask(task))
                        .catch((error: { message: any; })=>{
                            LOG.error(error.message);
                            message.channel.send('Não consegui remover a role de mute desse cara!');
                        });  
                },muteTime);
                
                punicao = 'Mute';
                // Feedback do comando para staff
                
            } else if ( warns.length === 3 ){
                // Kicka e retorna mensagem para dm
                punicao = 'Kick';
                
                member?.kick('Kickado por ter tomado warning demais')
                    .then(()=> message.reply('warn aplicado, o membro foi punido com Kick!'))
                    .catch((error: { message: any; })=>{
                        LOG.error(error.message);
                        message.reply('ouve um erro na execução do kick, provavelmente estou sem permissão!');
                    });  

            } else {
                // Bane o membro e manda mensagem no PV  
                punicao = 'Ban';
                
                member?.ban({reason: 'Tomou 4 warnings ¯\\_(ツ)_/¯'})
                    .then(()=> message.reply('warn aplicado, o membro foi punido com Ban!'))
                    .catch((error: { message: any; })=>{
                        LOG.error(error.message);
                        message.reply('ouve um erro na execução do ban, provavelmente estou sem permissão!');
                    });   
                
            }
            
            // Manda mensagem no pv
            
            try {
                member?.send( { embeds: [
                    {
                        title: `Você recebeu o seu ${warns.length}º warning! `,
                        color: 0xFF0000,
                        fields: [
                            { name: 'Motivo:', value: description },
                            { name: 'Punição:', value: punicao, inline: true}
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `${process.env.APP_NAME}`
                        }              
                    }
                ]
                });
            } catch ( ex ){
                LOG.error("Erro ao tentar enviar mensagem para o membro...");
                LOG.error(ex);
            }
            
            return message.reply(`Enviado warn para o membro \`${member?.displayName}\`!`);
        }
        return  message.reply(`membro \`${userId}\` não localizado!`);
    }
};

export = command;