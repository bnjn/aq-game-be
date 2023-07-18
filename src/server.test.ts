const request = require('supertest');
import app from './server';

describe('GET /', () => {
    afterEach( (done) => {
        setTimeout(() => done(), 500);
    });

    it('responds with a 200 status code',  (done) : void => {
        request(app).get('/').expect(200).end((err: Error) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });

    it('responds with "Working!" in the response body',(done) : void => {
        request(app).get('/').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.message).toMatch(/working!/i);
            return done();
        });

    });

    it('should respond with 429 status and error message when more than 2 requests are sent per second', (done) : void => {
            for (const i of [...Array(10)]) {
                request(app).get('/').end(() => done());
            }
            request(app).get('/').expect(429).end((err: Error, res: any) => {
                if (err) {
                    return done(err);
                }
                expect(res.error.text).toMatch(/Too many requests/i);
                return done();
            });
    });
});

describe('GET /states', () => {
    beforeAll( (done) => {
        setTimeout(() => done(), 1000);
    });

    afterEach( (done) => {
        setTimeout(() => done(), 500);
    });

    it('responds with 200 status code', (done) : void => {
        request(app).get('/states').expect(200).end((err: Error) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });

    it('responds with JSON', (done) : void => {
        request(app).get('/states').set('Accept', 'application/json').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.headers["content-type"]).toMatch(/json/);
            return done();
        });
    });

    it('responds with a states property containing an array', (done): void => {
      request(app).get('/states').end((err: Error, res: any) => {
          if (err) {
              return done(err);
          }
          expect(Array.isArray(res.body.states)).toEqual(true);
          return done();
      });
    });

    it('responds with at least one state as a string', (done): void => {
        request(app).get('/states').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.states.length).toBeGreaterThan(0);
            expect(typeof res.body.states[0]).toEqual('string')
            return done();
        });
    });

    it('should respond with 429 status and error message when more than 2 requests are sent per second', (done) : void => {
        for (const i of [...Array(10)]) {
            request(app).get('/states').end(() => done());
        }
        request(app).get('/states').expect(429).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.error.text).toMatch(/Too many requests/i);
            return done();
        });
    });
});

describe('GET /cities',() => {
    beforeAll( (done) => {
        setTimeout(() => done(), 1000);
    });

    afterEach( (done) => {
        setTimeout(() => done(), 500);
    });

    it('responds with 200 status code', (done) : void => {
        request(app).get('/cities').expect(200).end((err: Error) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });

    it('responds with JSON', (done) : void => {
        request(app).get('/cities').set('Accept', 'application/json').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.headers["content-type"]).toMatch(/json/);
            return done();
        });
    });

    it('responds with "Please send a POST with country=countryname and state=statename to /cities for a list of cities." in the response body',(done) : void => {
        request(app).get('/cities').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.message).toMatch(/Please send a POST with the body: \{ country: 'countryname', state: 'statename' } to \/cities for a list of cities\./i);
            return done();
        });
    });

    it('should respond with 429 status and error message when more than 2 requests are sent per second', (done) : void => {
        for (const i of [...Array(10)]) {
            request(app).get('/cities').end(() => done());
        }
        request(app).get('/cities').expect(429).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.error.text).toMatch(/Too many requests/i);
            return done();
        });
    });
});

describe('POST /cities',() => {
    beforeAll( (done) => {
        setTimeout(() => done(), 1000);
    });

    afterEach( (done) => {
        setTimeout(() => done(), 500);
    });

    it('responds with 200 status code', (done) : void => {
        request(app).post('/cities').expect(200).end((err: Error) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });

    it('responds with JSON', (done) : void => {
        request(app).post('/cities').set('Accept', 'application/json').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.headers["content-type"]).toMatch(/json/);
            return done();
        });
    });

    it('returns London when given a POST body containing United Kingdom and England',(done) : void => {
        request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.cities).toContain('London');
            return done();
        });
    });

    it('returns Bristol when given a POST body containing United Kingdom and England', (done): void => {
        request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.cities).toContain('Bristol');
            return done();
        });
    });

    it('returns a body with a message key containing "Country and/or state not found" when given a POST body containing invalid state', (done): void => {
        request(app).post('/cities').send({ country: 'United Kingdom', state: 'Engld' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.message).toMatch(/Country and\/or state not found/);
            return done();
        });
    });

    it('returns a body with a message key containing "Country and/or state not found" when given a POST body containing invalid country', (done): void => {
        request(app).post('/cities').send({ country: 'Unitdm', state: 'England' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.message).toMatch(/Country and\/or state not found/);
            return done();
        });
    });

    it('returns a body with a message key containing "Country and/or state not found" when given a POST body containing invalid country and state', (done): void => {
        request(app).post('/cities').send({ country: 'Unitdm', state: 'Engnd' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.message).toMatch(/Country and\/or state not found/);
            return done();
        });
    });

    it('returns Cardiff when given a POST body containing United Kingdom and Wales', (done): void => {
        request(app).post('/cities').send({ country: 'United Kingdom', state: 'Wales' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.cities).toContain('Cardiff');
            return done();
        });
    });

    it('should respond with 429 status and error message when more than 2 requests are sent per second', (done) : void => {
        for (const i of [...Array(10)]) {
            request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' }).end(() => done());
        }
        request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' }).expect(429).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.error.text).toMatch(/Too many requests/i);
            return done();
        });
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
    beforeAll((done) => {
        setTimeout(() => done(), 1000)
    });

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