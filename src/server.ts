import express from 'express';
import dotenv from "dotenv";
import fs from "fs";
import bodyParser from "body-parser";
import { getPollutionData } from "./api"
import {defaultLimiter, liveDataLimiter} from "./middleware/rateLimiter";

dotenv.config();
const app = express();
const jsonParser = bodyParser.json();

app.get('/', defaultLimiter, (req, res) => {
   res.send({message: 'Working!'}).status(200).end();
});

app.get('/states', async (req, res) => {
      if (fs.existsSync('./data/cities.json')) {
         res.type('json').send({
            states: jsonToStateArray('./data/cities.json')
         }).end()
      } else {
            console.log('data/cities.json not found');
            res.type('json').send('internal server error.').status(500).end();
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
   if (fs.existsSync('./data/cities.json')) {
      let cities: string[] = [];

      JSON.parse(fs.readFileSync('./data/cities.json', 'utf8')).forEach((city: any) => {
         const stateFound = city.state === req.body.state;
         const countryFound = city.country === req.body.country;
         if (stateFound && countryFound) {
            cities.push(city.city);
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

function jsonToStateArray(path: string): string[] {
    const states: string[] = JSON.parse(fs.readFileSync(path, 'utf8')).map((state: any) => state.state);
    return [...new Set(states)];
}

export default app;