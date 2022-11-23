/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Message, MessagePayload, AttachmentBuilder } from 'discord.js';
import { Logger } from '../../helpers';
import createReport from '../../helpers/reporter';
import { Command, CommandParams, CreatedReporter, Furmeet } from '../../interfaces';
import { ReportUser } from '../../interfaces/ReportUser';


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

            await Promise.all(furs!.map(async (fur: Furmeet) => {
                const furName = (await message.guild?.members.fetch(fur.userId))?.displayName;

                if (furName) {
                    //founded.push({...fur, name: furName });
                    report.worksheet.addRow({state: fur.state,userId: fur.userId, name: furName }).commit()
                }
            }));
            message.reply('Estarei enviando em seu privado o arquivo de backup!');
            
            report.workbook.commit().then(function() {
                Logger.info('Backup executado com sucesso!');
            });
            
            return (await message.author.createDM()).send(
                new MessagePayload(
                    await message.author.createDM(), { 
                        content: 'Segue backup dos membros, abraços.',
                        files: [new AttachmentBuilder(report.filename, { name: 'report'})]
                    }
                )
            );
        }
        return message.reply('Infelizmente, não achei ninguem nesse estado!');




    }
};

export = command;