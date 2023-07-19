const request = require('supertest');
const sinon = require('sinon');
const rateLimter = require('./middleware/rateLimiter');
const api = require('./api');

const originalLiveDataLimiter = rateLimter.liveDataLimiter;
const originalDefaultLimiter = rateLimter.defaultLimiter;
const liveDataLimiterStub = sinon.stub(rateLimter, 'liveDataLimiter');
const defaultLimiterStub = sinon.stub(rateLimter, 'defaultLimiter');

import app from './server';

describe('GET /', () => {
    beforeAll(() => {
        rateLimter.liveDataLimiter.callsFake((req: any, res: any, next: any) => next());
        rateLimter.defaultLimiter.callsFake((req: any, res: any, next: any) => next());
    })

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

    it('should respond with 429 status and error message when more than 2 requests are sent per second', async () : Promise<void> => {
        rateLimter.liveDataLimiter.callsFake(originalLiveDataLimiter);
        rateLimter.defaultLimiter.callsFake(originalDefaultLimiter);
        for (const i of [...Array(10)]) {
            await request(app).get('/');
        }
        const response = await request(app).get('/').expect(429)
        expect(response.error.text).toMatch(/Too many requests/i);
    });
});

describe('GET /states', () => {
    beforeAll(() => {
        rateLimter.liveDataLimiter.callsFake((req: any, res: any, next: any) => next());
        rateLimter.defaultLimiter.callsFake((req: any, res: any, next: any) => next());
    })

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

    it('should respond with 429 status and error message when more than 2 requests are sent per second', async () : Promise<void> => {
        rateLimter.liveDataLimiter.callsFake(originalLiveDataLimiter);
        rateLimter.defaultLimiter.callsFake(originalDefaultLimiter);
        for (const i of [...Array(10)]) {
            await request(app).get('/states');
        }
        const response = await request(app).get('/states').expect(429)
        expect(response.error.text).toMatch(/Too many requests/i);
    });
});

describe('GET /cities',() => {
    beforeAll(() => {
        rateLimter.liveDataLimiter.callsFake((req: any, res: any, next: any) => next());
        rateLimter.defaultLimiter.callsFake((req: any, res: any, next: any) => next());
    })

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

    it('should respond with 429 status and error message when more than 2 requests are sent per second', async () : Promise<void> => {
        rateLimter.liveDataLimiter.callsFake(originalLiveDataLimiter);
        rateLimter.defaultLimiter.callsFake(originalDefaultLimiter);
        for (const i of [...Array(10)]) {
            await request(app).get('/cities');
        }
        const response = await request(app).get('/cities').expect(429)
        expect(response.error.text).toMatch(/Too many requests/i);
    });
});

describe('POST /cities',() => {
    beforeAll(() => {
        rateLimter.liveDataLimiter.callsFake((req: any, res: any, next: any) => next());
        rateLimter.defaultLimiter.callsFake((req: any, res: any, next: any) => next());
    })

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

    it('should respond with 429 status and error message when more than 2 requests are sent per second', async () : Promise<void> => {
        rateLimter.liveDataLimiter.callsFake(originalLiveDataLimiter);
        rateLimter.defaultLimiter.callsFake(originalDefaultLimiter);
        for (const i of [...Array(10)]) {
            await request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' });
        }
        const response = await request(app).post('/cities').send({ country: 'United Kingdom', state: 'England' }).expect(429);
        expect(response.error.text).toMatch(/Too many requests/i);
    });
})

describe('GET /pollution_data',() => {
    beforeAll(() => {
        rateLimter.liveDataLimiter.callsFake((req: any, res: any, next: any) => next());
        rateLimter.defaultLimiter.callsFake((req: any, res: any, next: any) => next());
    })

    it('responds with 200 status code', (done) : void => {
        request(app).get('/pollution_data').expect(200).end((err: Error) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });

    it('responds with JSON', (done) : void => {
        request(app).get('/pollution_data').set('Accept', 'application/json').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.headers["content-type"]).toMatch(/json/);
            return done();
        });
    });

    it('responds with "Please send a POST with the body: { country: \'countryname\', state: \'statename\', city: \'cityName\' } to /pollution_data to get a cities pollution_data." in the response body',(done) : void => {
        request(app).get('/pollution_data').end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            expect(res.body.message).toMatch("Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data.");
            return done();
        });
    });

    it('should respond with 429 status and error message when more than 2 requests are sent per second', async () : Promise<void> => {
        rateLimter.liveDataLimiter.callsFake(originalLiveDataLimiter);
        rateLimter.defaultLimiter.callsFake(originalDefaultLimiter);
        for (const i of [...Array(10)]) {
            await request(app).get('/pollution_data');
        }
        const response = await request(app).get('/pollution_data').expect(429)
        expect(response.error.text).toMatch(/Too many requests/i);
    });
})

describe('POST /pollution_data',() => {
    beforeAll(() => {
        rateLimter.liveDataLimiter.callsFake((req: any, res: any, next: any) => next());
        rateLimter.defaultLimiter.callsFake((req: any, res: any, next: any) => next());
    })

    it('responds with 200 status code', (done) : void => {
        request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Bristol' }).expect(200).end((err: Error) => {
            if (err) {
                return done(err);
            }
            return done();
        });
    });

    it('responds with JSON', (done) : void => {
        const stub = sinon.stub(api, 'getPollutionData').resolves({
            "data": {
                "status": "success",
                "data": {
                    "city": "Bristol",
                    "state": "England",
                    "country": "United Kingdom",
                    "current": {
                        "pollution": {
                            "ts": "2023-06-06T12:00:00.000Z",
                            "aqius": 20
                        }
                    }
                }
            }
        });

        request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Bristol' }).set('Accept', 'application/json').end((err: Error, res: any) => {
            if (err) {
                stub.restore();
                return done(err);
            }
            try {
                expect(res.headers["content-type"]).toMatch(/json/);
                stub.restore();
                done();
            } catch(error) {
                stub.restore();
                done(error);
            }
        });
    });

    it('returns "Please send a POST with the body: { country: \'countryname\', state: \'statename\', city: \'cityName\' } to /pollution_data to get a cities pollution_data" when missing state in json.', (done) : void => {
        request(app).post('/pollution_data').send({ country: 'United Kingdom', city: 'Bristol' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            try {
                expect(res.body.message).toMatch("Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data");
                done();
            } catch(error) {
                done(error);
            }
        });
    });

    it('returns "Please send a POST with the body: { country: \'countryname\', state: \'statename\', city: \'cityName\' } to /pollution_data to get a cities pollution_data" when missing city in json.', (done) : void => {
        request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England' }).end((err: Error, res: any) => {
            if (err) {
                return done(err);
            }
            try {
                expect(res.body.message).toMatch("Please send a POST with the body: { country: 'countryname', state: 'statename', city: 'cityName' } to /pollution_data to get a cities pollution_data");
                done();
            } catch(error) {
                done(error);
            }
        });
    });

    it('returns "No data found for chosen city" if invalid city is entered', (done) : void => {
        const stub = sinon.stub(api, 'getPollutionData').rejects();

        request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Britol' }).end((err: Error, res: any) => {
            if (err) {
                stub.restore();
                return done(err);
            }
            try {
                stub.restore();
                expect(res.body.message).toMatch("No data found for chosen city");
                done();
            } catch(error) {
                stub.restore();
                done(error);
            }
        });
    });

    it('should respond with 429 status and error message when more than 2 requests are sent per minute', async () : Promise<void> => {
        rateLimter.liveDataLimiter.callsFake(originalLiveDataLimiter);
        rateLimter.defaultLimiter.callsFake(originalDefaultLimiter);
        const stub = sinon.stub(api, 'getPollutionData').resolves({
            "data": {
                "status": "success",
                "data": {
                    "city": "Bristol",
                    "state": "England",
                    "country": "United Kingdom",
                    "current": {
                        "pollution": {
                            "ts": "2023-06-06T12:00:00.000Z",
                            "aqius": 20
                        }
                    }
                }
            }
        });

        for (const i of [...Array(10)]) {
            await request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Bristol' });
        }
        const response = await request(app).post('/pollution_data').send({ country: 'United Kingdom', state: 'England', city: 'Bristol' }).expect(429);
        expect(response.error.text).toMatch(/Too many requests/i);
    });
})