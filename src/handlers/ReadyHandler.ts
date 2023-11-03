import { ActivityType, Client, Collection, Guild } from "discord.js";
import { CONSTANTS } from "../configs/Constants";
import { Logger as LOG } from "../helpers";

export default class ReadyHandler {
    async handle( client: Client ){
        // Adicionado nova funcionalidade que quando startar ele sai dos servidores não flagados como whitelisted
        client.guilds.cache.each( ( guild: Guild, _key: string, _collection: Collection<string, Guild>) => {
            if (!CONSTANTS.whitelistGroups.includes(guild.id)){
                LOG.warn(`[NOK] Eita, me colocaram no server: ${guild.name}, eu estou saindo!` );
                guild.leave();
            }
        });
        
        LOG.info(`[INIT] BOT: ${process.env.APP_NAME} - v${process.env.npm_package_version}`)
        LOG.info(`[INIT] Logado como ${client.user?.tag}! | conectado á ${client.guilds.valueOf().size} servidores` );
        LOG.info(`[INIT] https://discordapp.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot&permissions=8`);

        client.user?.setPresence({
            activities: [
                {
                    type: ActivityType.Listening,
                    name: `${process.env.APP_NAME} [v3 - 24/7]`,
                }
            ]
        });
    }
}