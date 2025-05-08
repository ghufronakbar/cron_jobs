import { configDotenv } from 'dotenv';
configDotenv()
import schedule, { scheduleTask } from "./modules/schedule/schedule.controller.js";
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { BASE_URL, PORT } from './constants/index.js';


const app = express();

//PARSE APPLICATION JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// ROUTES
app.use('/api/schedule', schedule);

import cron from 'node-cron';

cron.schedule('* * * * *', async () => {
    console.log('[DEBUG ENTRY CRON] - Cron job running');
})

scheduleTask();
async function main() {
    app.listen(PORT, () => {
        console.log('Starting server... in port', PORT);
        console.log('Server started successfully!');
        console.log(BASE_URL);
    })
}

main();