import express from 'express';
const app = express();

app.get('/', (req, res) => {
   res.send({message: 'Working!'}).status(200).end();
});

app.get('/states', (req, res) => {
   res.type('json').send({
      states: []
   }).end()
})
export default app;