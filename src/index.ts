require('dotenv').config(); // Recommended way of loading dotenv

import { Client } from "discord.js";
import {Bot} from "./bot";

new Bot( new Client(), process.env.TOKEN || '')
    .listen().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no! ', error)
    });