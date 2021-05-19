import { Command, CommandParams } from '../../interfaces';

const command : Command = {
    name: 'local',
    description: 'Cadastra ou atualiza seu local de Meetings!',
    usage: '<UF>',
    cooldown: 5,
    execute( { message } : CommandParams){
        // TODO Implement
    }
};

export = command;