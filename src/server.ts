import express from 'express';
const app = express();

app.get('/', (req, res) => {
   res.send({message: 'Working!'}).status(200).end();
});
export default app;