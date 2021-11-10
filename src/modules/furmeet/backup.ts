/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Message, MessageAttachment } from 'discord.js';
import { Logger } from '../../helpers';
import createReport from '../../helpers/reporter';
import { Command, CommandParams, CreatedReporter, Furmeet } from '../../interfaces';
import { ReportUser } from '../../interfaces/ReportUser';
import validateState from '../../utils/validateState';

const command: Command = {
    name: 'backup',
    description: 'Realiza o backup do furmeet para a staff!',
    guildOnly: true,
    adminOnly: true,
    cooldown: 120,
    async execute({ message, furmeetRepository }: CommandParams) : Promise<Message[]|Message>  {

        const founded: ReportUser[] = [];
        
        const report : CreatedReporter  = await createReport();


        const furs = await furmeetRepository?.getAllUsers();

        if (furs?.length !== 0) {

            message.channel.send('Montando backup...');

            await Promise.all(furs!.map((fur: Furmeet) => {
                const furName = message.guild?.member(fur.userId)?.displayName;

                if (furName) {
                    //founded.push({...fur, name: furName });
                    report.worksheet.addRow({state: fur.state,userId: fur.userId, name: furName }).commit()
                }
            }));
            message.reply('Estarei enviando em seu privado o arquivo de backup!');
            
            report.workbook.commit().then(function() {
                Logger.info('Backup executado com sucesso!');
            });
            
            return (await message.author.createDM()).send('Segue backup dos membros, abraços.', new MessageAttachment(report.filename));
        }
        return message.reply('Infelizmente, não achei ninguem nesse estado!');




    }
};

export = command;