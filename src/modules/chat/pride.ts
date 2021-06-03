import { MessageEmbed, MessageAttachment } from 'discord.js';
import { Command, CommandParams } from '../../interfaces';
import getRandomEmoji from '../../utils/getRandomEmoji';
import downloadAvatar from '../../utils/downloadAvatar';
import mergeImage from '../../utils/mergeImage';

const command : Command = {
    name: 'pride',
    description: 'Cria avatar com a bandeira.',
    usage: '[Flag]',
    aliases: ['prideflag', 'orgulho'],
    cooldown: 5,
    guildOnly: true,
    async execute({ message, args } : CommandParams){
        
        const prides = {
            'ace': 'ace',
            'bi': 'bi',
            'gay': 'gay',
            'lesbian': 'lesbian',
            'lgbt': 'lgbt',
            'nonbinary': 'nonbinary',
            'pan': 'pan',
            'trans': 'trans',
            'demi': 'demi',
            'genderfluid': 'genderfluid'
        }

        // @ts-ignore
        const pride : string = prides[String(args![0]).toLowerCase()];

        if ( ! pride || !args ){
             return message.reply(new MessageEmbed({
                title: ':gay_pride_flag: Lista de bandeiras disponíveis: :gay_pride_flag:',
                description: Object.keys(prides).map( key => ` • ${key[0].toUpperCase()}${key.slice(1)}`).join('\n'),
                color: 0xbd00ff
            }))
        }
        
        message.reply('só um momento, to fazendo aqui!');
        
        const url = message.author.avatarURL({ format: 'png', size: 2048});
        
        const file = await downloadAvatar(url!, `./temp/${message.author.id}.png` )
        
        const image = await mergeImage(file, `./resources/pride/${pride}.png`, message.author.id);
        
        const attachment = new MessageAttachment(image, `${message.author.id}.png`);
        
        message.channel.send( attachment);
        
        return message.channel.send('Finalizado, espero que goste!');
        
    }
};

export = command;