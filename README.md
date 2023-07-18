# AQ-Game-BE

### Setup
- Run `npm install`.
- Create `.env` file in base directory.
- Get API key from https://www.iqair.com/dashboard/api
- Add `AIRVISUAL_API_KEY="yourapikey"` to `.env`.
- Add `PORT=3000` to `.env`
- (Optional) Add `COUNTRY="countrytouse"` to `.env`. Otherwise defaults to United Kingdom.

### Usage
- Run `npm start`.

### Dev
- `npm run dev` for hot reloading. Currently doesn't reload for `.ts` file changes, need to fix this!
- `npm test` to run unit tests. If tests fail on first run, try running `npm run dev` or `npm start` to grab the data from AQ API.
- `npm run tsc` for TypeScript compiler.
- `npm run build` to build ts files.
- `npm run clean` to clean build files.

### TODO
- Use Reddis instead of `.json` files
- Cache pollution data to DB and retrieve from there if AQ API unavailable or data is less than 24hrs old.
- Front end (React)
~~- Rate limits~~
- CI/CD
- Deploy to AWS free tier