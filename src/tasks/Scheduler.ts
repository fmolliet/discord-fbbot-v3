import cron from "node-cron";
import { Logger } from '../helpers';

export default class Scheduler { 
    public static schedule(cronTime: string, func : string | ((now: Date | "manual" | "init") => void) ) {
        Logger.info("[SCHEDULE] Cadastrada tarefa no node-cron");
        cron.schedule(cronTime, func);
    }
}