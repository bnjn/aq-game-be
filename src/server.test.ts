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

describe('GET /cities',() => {
    it('responds with JSON', async () : Promise<void> => {
        const response = await request(app).get('/cities').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
    });

    it('responds with "Please send a POST with country=countryname and state=statename to /cities for a list of cities." in the response body',async () : Promise<void> => {
        const response = await request(app).get('/cities');
        expect(response.body.message).toMatch(/Please send a POST with the body: \{ country: 'countryname', state: 'statename' } to \/cities for a list of cities\./i);
    });
})

describe('POST /cities',() => {
    it('responds with JSON', async () : Promise<void> => {
        const response = await request(app).post('/cities').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
    });

    it('returns London when given a POST body containing United Kingdom and England', async (): Promise<void> => {
        const response = await request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' });
        expect(response.body.cities).toContain('London');
    });

    it('returns Bristol when given a POST body containing United Kingdom and England', async (): Promise<void> => {
        const response = await request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' });
        expect(response.body.cities).toContain('Bristol');
    });

    it('returns a body with a message key containing "Country and/or state not found" when given a POST body containing invalid state', async (): Promise<void> => {
        const response = await request(app).post('/cities').send({ country: 'United Kingdom', state: 'Engld' });
        expect(response.body.message).toMatch(/Country and\/or state not found/);
    });

    it('returns a body with a message key containing "Country and/or state not found" when given a POST body containing invalid country', async (): Promise<void> => {
        const response = await request(app).post('/cities').send({ country: 'ited Kom', state: 'England' });
        expect(response.body.message).toMatch(/Country and\/or state not found/);
    });

    it('returns a body with a message key containing "Country and/or state not found" when given a POST body containing invalid country and state', async (): Promise<void> => {
        const response = await request(app).post('/cities').send({ country: 'ited Kom', state: 'Eland' });
        expect(response.body.message).toMatch(/Country and\/or state not found/);
    });

    it('returns Cardiff when given a POST body containing United Kingdom and Wales', async (): Promise<void> => {
        const response = await request(app).post('/cities').send({ country: 'United Kingdom', state: 'Wales' });
        expect(response.body.cities).toContain('Cardiff');
    });

})

describe('GET /pollution_data',() => {
    it('responds with JSON', async () : Promise<void> => {
        const response = await request(app).get('/pollution_data').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
    });
   
    it('responds with "Please send a POST with country=countryname and state=statename to /cities for a list of cities." in the response body',async () : Promise<void> => {
        const response = await request(app).get('/pollution_data');
        expect(response.body.message).toMatch("Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data.");
    });
})

describe('POST /pollution_data',() => {
    it('responds with JSON', async () : Promise<void> => {
        const response = await request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Bristol' });
        expect(response.headers["content-type"]).toMatch(/json/);
    });

    it('returns "Please send a POST with the body: { country: \'countryname\', state: \'statename\', city: \'cityName\' } to /pollution_data to get a cities pollution_data" when missing element in json.', async () : Promise<void> => {
        const response = await request(app).post('/pollution_data').send({ country: 'United Kingdom', city: 'Bristol' });
        expect(response.body.message).toMatch("Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data");
    });

    it('returns "Please send a POST with the body: { country: \'countryname\', state: \'statename\', city: \'cityName\' } to /pollution_data to get a cities pollution_data" when missing element in json.', async () : Promise<void> => {
        const response = await request(app).post('/pollution_data').send({ country: 'United Kingdom', city: 'Bristol' });
        expect(response.body.message).toMatch("Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data");
    });

    it('returns "No data found for chosen city" if invalid city is entered', async () : Promise<void> => {
        const response = await request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Britol' });
        expect(response.body.message).toMatch("No data found for chosen city");
    });
})