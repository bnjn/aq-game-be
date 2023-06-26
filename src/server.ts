import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";
import { getPollutionData } from "../../../aq-game-be/src/api"
const app = express();

const jsonParser = bodyParser.json();

app.get('/', (req, res) => {
   res.send({message: 'Working!'}).status(200).end();
});

app.get('/states', (req, res) => {
   if (fs.existsSync('./data/cityData.json')) {
      const states = JSON.parse(fs.readFileSync('./data/cityData.json', 'utf8')).map((state: any) => state.state)
      res.type('json').send({
         states: states
      }).end()
   } else {
      res.type('json').send('internal server error').status(500).end();
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
      getPollutionData(country, state, city).then(data => {
         res.type('json').send(data).end();
   
      }).catch(err => {
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

export default app;