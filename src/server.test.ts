const request = require('supertest');
import app from './server';

describe('GET /', () => {
    it('responds with a 200 status code', async () : Promise<void> => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    it('responds with "Working!" in the response body',async () : Promise<void> => {
       const response = await request(app).get('/');
       expect(response.body.message).toMatch(/working!/i);
    });
});