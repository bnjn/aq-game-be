import fs from "fs";
import {getCityList, getCountryList, getStateList} from "./api";
const qrate = require('qrate');

// Functions to save data from the api functions to json files.

export async function saveCountryData(): Promise<void> {
    getCountryList().then((data) => {
        console.log(data)
        fs.writeFile("./data/countryData.json", JSON.stringify({countries: data}), (error) => {
            if (error) {
                console.log(error)
            }
        })
    }).catch(e => console.log(e))
}

export async function saveStateData(countries: string[]): Promise<void> {
    let states : object[] = [];
    const worker = function(country: string, done: Function) {
        getStateList(country).then((data) => {
            states.push({
                country: country,
                last_updated: new Date(),
                states: data
            });
            fs.writeFileSync("./data/states.json", JSON.stringify(states), 'utf-8');
        })
            .catch(e => console.log(e));
        // Max 5 calls per minute
        setTimeout(done, 13000);
    }

    if (fs.existsSync('./data/states.json')) {
        const queue = qrate(worker, 1, 1);
        const existingCountries = JSON.parse(fs.readFileSync('./data/states.json', 'utf8')).map((country: any) => country.country);
        const allCountries = new Set([...countries, ...existingCountries]);
        [...allCountries].forEach((country) => {
            console.log('Processing', country, '@', new Date().getTime());
            queue.push(country)
        });
    } else {
        const queue = qrate(worker, 1, 1);
        countries.forEach((country) => {
            console.log('Processing', country, '@', new Date().getTime());
            queue.push(country)
        });
    }



}

// export async function saveCityData(): Promise<void> {
//     // TODO: tests for state not found and too many requests.
//     if (fs.existsSync('./stateData.json')) {
//         let cities : object[] = [];
//
//         fs.readFile('./data/stateData.json', 'utf8', (err, data) => {
//             if (err) {
//                 console.log(err);
//             }
//
//             const worker = function(state: any, done: Function) {
//                 console.log('Processing', state.country, state.name, '@', new Date().getTime());
//                 getCityList(state.country, state.name).then((data) => {
//                     cities.push({
//                         country: state.country,
//                         last_updated: new Date(),
//                         state: state.name,
//                         cities: data
//                     });
//                     fs.writeFileSync("./data/cityData.json", JSON.stringify(cities), 'utf-8');
//                 })
//                     .catch(e => console.log(e));
//                 // Max 5 calls per minute
//                 setTimeout(done, 13000);
//             }
//
//             const queue = qrate(worker, 1, 1);
//
//             const countries: Array<any> = JSON.parse(data);
//             countries.forEach((country: any) => {
//                 if (country.country === 'United Kingdom') {
//                     country.states.forEach((state: any) => {
//                         queue.push({country: country.country, name: state});
//                     });
//                 }
//             });
//
//
//         });
//     } else {
//         saveStateData().then(() => saveCityData()).catch(e => console.log(e));
//     }
// }

// Save data
// saveCountryData()
// saveStateData();
// saveCityData();