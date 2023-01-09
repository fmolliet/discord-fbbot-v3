import { Logger } from '../../helpers';
import { Command, CommandParams } from '../../interfaces';

import birthdayServices from '../../services/BirthdayService';

const command : Command = {
    name: 'birthday',
    description: 'Cadastra seu aniversário para ser marcado no dia!',
    usage: '[dia] [mes]',
    guildOnly: true,
    cooldown: 60,
    aliases: ['aniversario', 'niver', 'bd', 'birthdays'],
    hasArgs : true,
    async execute({ message , args } : CommandParams ){
        const data = {
            day: parseInt(args![0]),
            month: parseInt(args![0]),
            name: message.author.username,
            snowflake: message.author.id
        };
        //Logger.info(data)
        
        try {
            const birthday = await birthdayServices.get(`/birthday/${message.author.id}`);

            if (birthday.data != null && birthday.data != "" ){
                await birthdayServices.patch('/birthday', data);
                return message.channel.send('Aniversário atualizado com sucesso.');
            }
        } catch ( ex ){
            console.error(ex)
            Logger.warn("Erro ao cadastrar no serviço de aniversário", ex)
            return message.channel.send('Não consegui cadastrar seu aniversário, tente novamente mais tarde.');
        }
        
        try {
            await birthdayServices.post('/birthday', data);
        } catch ( ex ){
            console.error(ex)
            Logger.warn("Erro ao cadastrar no serviço de aniversário", ex)
            return message.channel.send('Não consegui cadastrar seu aniversário, tente novamente mais tarde.');
        }
        
        return message.channel.send('Obrigado, seu niver foi gravado com sucesso.');
    }
};

export = command;