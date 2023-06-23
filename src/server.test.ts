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

describe('GET /states', () => {
    it('responds with JSON', async () : Promise<void> => {
       const response = await request(app).get('/states').set('Accept', 'application/json');
       expect(response.headers["content-type"]).toMatch(/json/);
    });

    it('responds with a states property containing an array', async (): Promise<void> => {
      const response = await request(app).get('/states');
      expect(Array.isArray(response.body.states)).toEqual(true);
    });

    it('responds with at least one state as a string', async (): Promise<void> => {
        const response = await request(app).get('/states');
        expect(response.body.states.length).toBeGreaterThan(0);
        expect(typeof response.body.states[0]).toEqual('string')
    });
});