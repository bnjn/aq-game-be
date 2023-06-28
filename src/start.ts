import app from './server';
import dotenv from 'dotenv';
import fs from "fs";
const qrate = require('qrate');
import {getCityList, getStateList} from "./api";

dotenv.config()

const port = process.env.PORT ?? 3000;

function start() {
    let cities: object[] = [];
    const worker = function (state: any, done: Function) {
        console.log('Processing', state, '@', new Date().getTime());
        getCityList(state.country, state.state).then((data) => {
            data.forEach((city: string) => {
                cities.push({
                    country: state.country,
                    last_updated: new Date(),
                    state: state.state,
                    city: city
                });
            });
            fs.writeFileSync("./data/cities.json", JSON.stringify(cities), 'utf-8');
            setTimeout(done,15000);
        });

    }
    const queue = qrate(worker, 1, 1);
    getStateList('United Kingdom' ?? process.env.COUNTRY).then((states) => {
        states.forEach((state: string) => {
            queue.push({state: state, country: 'United Kingdom' ?? process.env.COUNTRY})
        });
    });

    queue.drain = () => {
        // all of the queue items have been processed
        console.log(`Data written to data/cities.json`);
        app.listen(port);
        console.log(`Air Quality API started on port ${process.env.PORT}`)
    }
}

start();
