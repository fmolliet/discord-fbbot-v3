import 'dotenv/config';
import 'reflect-metadata';

import { Bot    } from './bot';
import { config } from './configs/app';

new Bot( config )
    .listen().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no! ', error)
    });