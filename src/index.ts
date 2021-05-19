import 'dotenv/config';
import 'reflect-metadata';

import { Bot    } from './bot';
import { config } from './configs/app';
import { Logger } from './helpers';

console.clear();

new Bot( config )
    .listen().then(() => {
        Logger.info('Bot iniciado e logado!');
    }).catch((error) => {
        Logger.info('Oh no! ', error);
    });