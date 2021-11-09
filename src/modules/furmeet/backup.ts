/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Command, CommandParams } from '../../interfaces';
import validateState from '../../utils/validateState';

const command: Command = {
    name: 'backup',
    description: 'Realiza o backup do furmeet para a staff!',
    guildOnly: true,
    adminOnly: true,
    cooldown: 15,
    async execute({ message, furmeetRepository }: CommandParams) {

        const founded: string[] = [];


        const furs = await furmeetRepository?.getAllUsers();

        if (furs?.length !== 0) {

            message.reply('Montando backup...');

            await Promise.all(furs!.map((fur) => {
                const furName = message.guild?.member(fur.userId)?.displayName;

                if (furName) {
                    founded.push(furName);
                }
            }));

            return message.channel.send(`\`\`\`${founded.join('\n')}\`\`\``, { split: true });

        }
        return message.reply('Infelizmente, não achei ninguem nesse estado!');




    }
};

export = command;