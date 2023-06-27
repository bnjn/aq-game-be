import express from 'express';
import dotenv from "dotenv";
import fs from "fs";
import bodyParser from "body-parser";
import { getPollutionData } from "./api"
import {saveStateData} from "./scrape";

dotenv.config();
const app = express();
const jsonParser = bodyParser.json();

app.get('/', (req, res) => {
   res.send({message: 'Working!'}).status(200).end();
});

app.get('/states', async (req, res) => {
      if (fs.existsSync('./data/states.json')) {
         res.type('json').send({
            states: stateJsonToArray('./data/states.json')
         }).end()
      } else {
            console.log('data/states.json not found');
            res.type('json').send('internal server error. please try again in a moment.').status(500).end();
            saveStateData([process.env.COUNTRY ?? 'United Kingdom']).then(() => {
            console.log(`State data written to data/states.json`);
            }).catch((err) => { console.log(err)});
      }
});

app.get('/cities', (req, res) => {
   res.type('json').send(
       {
          message: "Please send a POST with the body: { country: 'countryname', state: 'statename' } to /cities for a list of cities."
       }
   ).end();
});

app.post('/cities', jsonParser, (req, res) => {
   if (fs.existsSync('./data/cityData.json')) {
      let cities: string[] = [];

      JSON.parse(fs.readFileSync('./data/cityData.json', 'utf8')).forEach((state: any) => {
         const stateFound = state.state === req.body.state;
         const countryFound = state.country === req.body.country;
         if (stateFound && countryFound) {
            cities.push(...state.cities);
         }
      });
      if (cities.length === 0) {
         res.type('json').send(
             {
                message: "Country and/or state not found"
             }
         ).end();
      } else {
         res.type('json').send({cities: cities}).end();
      }
   } else {
      res.type('json').send('internal server error').status(500).end();
   }
});

app.get('/pollution_data', (req, res) => {
   res.type('json').send(
       {
          message: "Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data." 
       }
   ).end();
});

app.post('/pollution_data', jsonParser, (req, res) => {
   const [country, state, city ] = [req.body.country, req.body.state, req.body.city]
   const isNotEmpty = country && state && city
   if (isNotEmpty) {
      getPollutionData(country, state, city).then((data: any) => {
         res.type('json').send(data).end();
   
      }).catch((err: any) => {
         res.type('json').send(
         {
            message: "No data found for chosen city"         
         }
         ).end();
      })
   } else {
      res.type('json').send(
         {
            message: "Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data." 
         }
     ).end();
   }
});

function stateJsonToArray(path: string) {
      let states: string[] = [];
      JSON.parse(fs.readFileSync(path, 'utf8')).forEach((country: any) => {
         country.states.forEach((state: string) => states.push(state));
      });
      return states;
}

export default app;