import app from './server';
import dotenv from 'dotenv';

dotenv.config()
app.listen(process.env.PORT);
console.log(`Air Quality API started on port ${process.env.PORT}`)