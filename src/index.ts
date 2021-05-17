import 'dotenv/config';
import 'reflect-metadata';

import { Bot    } from './bot';
import { config } from './configs/app';

console.clear();

new Bot( config )
    .listen().then(() => {
        console.log('Bot iniciado e logado!');
    }).catch((error) => {
        console.log('Oh no! ', error);
    });