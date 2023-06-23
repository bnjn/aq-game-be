const request = require('supertest');
import app from './server';

describe('GET /', () => {
    it('responds with a 200 status code', async () : Promise<void> => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});