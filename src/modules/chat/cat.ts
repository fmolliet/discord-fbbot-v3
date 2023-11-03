import { Command, CommandParams } from '../../interfaces';

function getCat(){
    const cats = [
        'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
        'https://media2.giphy.com/media/8vQSQ3cNXuDGo/giphy.gif',
        'https://media0.giphy.com/media/12PA1eI8FBqEBa/giphy.gif',
        'https://78.media.tumblr.com/c863675755e2edaeb07a8213c1822fac/tumblr_p2fyly5vAo1vwvx0xo2_540.gif',
    ];
    const randomNumber = Math.floor(Math.random()*cats.length);
    return cats[randomNumber];
}

const command : Command = {
    name: 'cat',
    aliases: ['cats', 'gato', 'gatos'],
    description: 'Manda gifs de gatos fofos',
    cooldown: 5,
    hasSlashSupport: true,
    dm_permission: true,
    slash: async(interaction)=>{
        interaction.reply(getCat())
    },
    async execute( { message } : CommandParams){
        
        return message.channel.send(getCat());
    }
};

export = command;