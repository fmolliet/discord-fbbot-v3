import isImage from 'is-image';
import { CommandParams, Command } from '../../interfaces';

const command : Command = {
    name: 'botavatar',
    description: 'Troca o avatar do bot',
    guildOnly: true,
    adminOnly: true,
    hasAttachment : true,
    execute({ message, client } : CommandParams){
        
        const image = message.attachments.first()?.url;
        if ( isImage(image!) ) {
            client?.user?.setAvatar(image!);
            return message.reply('imagem de perfil alterada!');
        }
        return message.reply('precisa ser anexado um arquivo do tipo imagem!');
    }
};

export = command;