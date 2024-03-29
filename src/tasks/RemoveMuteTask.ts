/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from 'discord.js';
import { CONSTANTS } from '../configs/Constants';
import { Logger } from '../helpers';
import taskRepository from '../repositories/TaskRepository';

export async function removeMuteTask( client: Client) : Promise<void>{
    
    const muteRoleId = process.env.NODE_ENV === 'dev'? '845850171975139328' : CONSTANTS.muteRoleId;
    
    // Busca todas tasks para executarem
    const tasks = await taskRepository.getAllTasks();
    
    for await ( const task of tasks! ){
        
        const now = new Date(Date.now());
        const guild = client.guilds.cache.get(task!.guildId);
        
        if ( guild ){
            try {
                const member = await guild?.members.fetch(task!.userId!);
                const role = guild?.roles.cache.get(muteRoleId);
                
                if (member && role){
                    
                    const muteRemainTime = (task?.executeOn.getTime() || 1 ) - now.getTime();
    
                    setTimeout( async()=> {
                        member?.roles.remove(role).catch(error =>  Logger.error(`Erro ao tentar remover a role:`, error ));
                        Logger.info(`Deletando task...: ${task!._id}`)
                        await taskRepository?.deleteTask(task!);
                    },  ( (task?.executeOn.getTime() || 1) > now.getTime() ? muteRemainTime : 1) );
                }
            } catch ( err ){
                Logger.warn(`Erro ao localizar usuário, na task de remoção de mute: ${task!.userId!}`)
                Logger.info(`Deletando task...: ${task!._id}`)
                await taskRepository?.deleteTask(task!);
            }

        }        
        
    }
    
    
    
}
