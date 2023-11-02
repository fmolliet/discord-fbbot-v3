import 'dotenv/config';
import 'reflect-metadata';

import { Bot    } from './bot';
import { config } from './configs/app';
import { Logger as LOG } from './helpers';

console.clear();

new Bot( config )
    .listen().then(() => {
        LOG.info('Bot inicializado.');
    }).catch((error) => {
        LOG.error('Oh no! ', error);
    });