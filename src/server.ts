import express from 'express';
import fs from "fs";
const app = express();

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

export default app;