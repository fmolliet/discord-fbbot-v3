import cron from "node-cron";
import { Logger } from '../helpers';
import { Channel, Client, StickerType } from "discord.js";
import { EmbedBuilder } from '@discordjs/builders';
import service from "../services/AnnounceService";
import birthdayServices from "../services/BirthdayService";
import calculateNextPostTime from "../utils/calculateNextPostTime";
import { CONSTANTS } from "../configs/Constants";

export default class Scheduler {

    private client: Client

    constructor(client: Client) {
        this.client = client;
    }

    async init() {
        Logger.info(`[SCHEDULE] Inicializando scheduler!`)
        const client = this.client;

        cron.schedule("*/15 * * * *", async () => {
            Logger.info(`[SCHEDULE] Buscando anuncios...`)
            const announces = await service.getAnnounces();
            Logger.info(announces)
            const now = new Date();
            Logger.info(`[SCHEDULE] ${announces.length} anuncios encontrados!`)
            announces.forEach(async (announce: Announce) => {
                const nextPostTime = calculateNextPostTime(announce.lastPosted, announce.frequency);
                if (now >= nextPostTime) {
                    Logger.info(`[SCHEDULE] Anunciando ${announce._id} no <#${announce.channelId}>`)
                    const channel = await client.channels.fetch(announce.channelId);

                    if (channel?.isTextBased()) {

                        await channel.send(announce.message);
                        announce.lastPosted = now;
                        await service.updateAnnounce(announce);
                    }
                }

            })
        })

        // TODO: Refatorar
        cron.schedule("0 8 * * *", async () => {
            const now = new Date();
            Logger.info(`[SCHEDULE] Configurando job de aniversário!`)
            const channel = await client.channels.fetch(process.env.BIRTHDAY_CHANNEL_ID ?? "1276005497392074845");

            if (channel?.isTextBased()) {
                const birthdays = await birthdayServices.getBirthDaysFromToday();

                if (birthdays.length > 0) {

                    const aniversarios: string[] = [];

                    birthdays.forEach(birthday => {
                        aniversarios.push(`<@${birthday.snowflake}>`);
                    });

                    await this.sendMessageBirthDayMessageIn([channel], `:cake: Feliz Aniversário para galera do dia ${this.pad(now.getDate())}/${this.pad(now.getMonth() + 1)}`, aniversarios)

                } else {
                    Logger.info(`[SCHEDULE] Ninguem fez aniversário hoje!`)
                }

            }
        }, {
            scheduled: true,
            timezone: "America/Sao_Paulo"
        });

        cron.schedule("0 8 2 * *", async () => {
            const now = new Date();
            Logger.info(`[SCHEDULE] Configurando job de aniversário de staff!`)

            const channelList: Channel[] = [];
            for (const staffChatId of CONSTANTS.staffChats) {
                
                try {
                    Logger.debug(`[SCHEDULE] Buscando canal de staff: ${staffChatId}`)
                    const channel = await client.channels.fetch(staffChatId);
                    if (channel != null && channel?.isTextBased()) {
                        channelList.push(channel);
                    }
                } catch (error) {
                    Logger.error(`[SCHEDULE] Erro ao buscar canal de staff: ${staffChatId}`, error);
                }
                

            }
            const birthdays = await birthdayServices.getBirthDaysFromMonth();
            Logger.debug(`[SCHEDULE] Numero de aniversariantes do mês: ${birthdays.length}`)
            if (birthdays.length > 0) {

                const aniversarios: string[] = [];

                for await (const birthday of birthdays) {
                    try { 
                        // Verificar se o usuário está n guild 
                        const guildId = process.env.ENVIRONMENT == "prod"? "201135803655520257": "839862362873659392";
                        const guild = await client.guilds.fetch({ guild: guildId });
                        const guildMember = await guild.members.fetch(birthday.snowflake);

                        // vai localizar admins e moderadores ou colaboradores
                        if (guildMember.permissions.has("KickMembers", true) || guildMember.roles.cache.some(role => CONSTANTS.collabRoleId.includes(role.id))) {
                            aniversarios.push(`<@${birthday.snowflake}> - ${this.pad(birthday.day)}/${this.pad(birthday.month)}`);
                        }
                    } catch (error) {
                        Logger.error(`[SCHEDULE] Erro ao buscar guild member: ${birthday.snowflake}`, error);
                    }
                }
                await this.sendMessageBirthDayMessageIn(channelList, `:cake: Segue os aniversáriantes dos staffs do mês de ${now.toLocaleString('pt-BR', { month: 'long' })}`, aniversarios)


            } else {
                Logger.info(`[SCHEDULE] Nenhum staff fez aniversário no mês!`)
            }

        }, {
            scheduled: true,
            timezone: "America/Sao_Paulo",
        });

    }

    private pad(num = 0, desiredLength = 2) {
        let paddedNumber = String(num);
        while (paddedNumber.length < desiredLength) {
            paddedNumber = `0${paddedNumber}`;
        }
        return paddedNumber;
    }

    private async sendMessageBirthDayMessageIn(channelList: Channel[], message: string, aniversarios: string[]) {
        for await (const channel of channelList) {
            if (channel?.isTextBased()) {
                await channel.send(message)
                await channel.send(`Aniversariantes são: \n${aniversarios.join("\n")}`);
                await channel.send(":tada: :birthday: :tada:")
                await channel.send(":exclamation: Caso queira cadastrar seu aniversário, use o comando `!bd` `<dia>/<mês>` !")
                await channel.send({ stickers: [process.env.BIRTHDAY_STICKER_ID ?? "1229592033384202241"] })
                await channel.send("Atenciosamente, Furry Brasil 2.0.")
            }
        }

    }

}