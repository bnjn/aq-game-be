import app from './server';
import dotenv from 'dotenv';
import fs from "fs";
import {saveStateData} from "./scrape";

dotenv.config()

const port = process.env.PORT ?? 3000;

if (fs.existsSync('./data/states.json')) {
    console.log('State data found at data/states.json');
    app.listen(port);
    console.log(`Air Quality API started on port ${process.env.PORT}`)
} else {
    saveStateData([process.env.COUNTRY ?? 'United Kingdom']).then(() => {
        console.log(`State data written to data/states.json`);
    }).finally(() => {
        app.listen(port);
        console.log(`Air Quality API started on port ${process.env.PORT}`)
    }).catch((err) => { throw err});
}

