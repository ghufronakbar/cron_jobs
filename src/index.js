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

async function main() {
    app.listen(PORT, async () => {
        console.log('Starting server... in port', PORT);
        await scheduleTask();
        console.log('Server started successfully!');
        console.log(BASE_URL);
    })
}

main();