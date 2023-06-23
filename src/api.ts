import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getCountryList() : Promise<any> {
    try {
        const response = await axios.get(`https://api.airvisual.com/v2/countries?key=${process.env.AIRVISUAL_API_KEY}`);
        return Promise.resolve(response.data.data.map((country: { country: object }) => country.country));
    } catch (error: any) {
        if (error.response.data.status === 'fail') {
            return Promise.reject(new Error(`Error status from AirVisual API: ${error.response.data.data.message}`));
        }
    }
}


export async function getStateList(country: string) : Promise<any> {
    try {
        const response = await axios.get(`https://api.airvisual.com/v2/states?country=${country}&key=${process.env.AIRVISUAL_API_KEY}`);
        return Promise.resolve(response.data.data.map((state: { state: object }) => state.state));
    } catch (error: any) {
        if (error.response.data.status === 'fail') {
                if (error.response.data.data.message === 'country_not_found') {
                    return Promise.reject(new Error(`AirVisual API: country not found "${country}"`));
                } else {
                    return Promise.reject(new Error(`Error status from AirVisual API: ${error.response.data.data.message}`));
                }
        }
    }
}

export async function getCityList(country: string, state: string): Promise<any> {
    // AQ api responds with state_not_found if either the state or country are not found. Need to inform with a thrown error. Maybe validate against local data before making the call to the city endpoint?
    try {
        const response = await axios.get(`http://api.airvisual.com/v2/cities?state=${state}&country=${country}&key=${process.env.AIRVISUAL_API_KEY}`);
        return Promise.resolve(response.data.data.map((city: { city: object }) => city.city));
    } catch (error: any) {
        if (error.response.data.status === 'fail') {
            if (error.response.data.data.message === 'country_not_found') {
                return Promise.reject(new Error(`AirVisual API: country/state not found "${country}"/"${state}"`));
            } else {
                return Promise.reject(new Error(`Error status from AirVisual API: ${error.response.data.data.message}`));
            }
        }
    }
}

export async function getPollutionData(country: string, state: string, city: string): Promise<any> {
    type PollutionData = {
        city: string,
        state: string,
        country: string,
        lastUpdated: Date,
        airQualityIndex: number
    }

    try {
        const response = await axios.get(`http://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${process.env.AIRVISUAL_API_KEY}`);
        const output: PollutionData = {
            city: response.data.data.city,
            state: response.data.data.state,
            country: response.data.data.country,
            lastUpdated: new Date(response.data.data.current.pollution.ts),
            airQualityIndex: response.data.data.current.pollution.aqius
        };
        return Promise.resolve(output);
    } catch (error: any) {
        if (error.response.data.status === 'fail') {
            if (error.response.data.data.message === 'country_not_found') {
                return Promise.reject(new Error(`AirVisual API: country/state/city not found "${country}"/"${state}"/"${city}"`));
            } else {
                return Promise.reject(new Error(`Error status from AirVisual API: ${error.response.data.data.message}`));
            }
        }
    }
}



// Live API tests
// getCountryList().then((data) => console.log(data)).catch(e => console.log(e))
// getStateList('United Kingdom').then((data) => console.log(data)).catch((e) => console.log(e));
// getStateList('China').then((data) => console.log(data)).catch((e) => console.log(e));
// getStateList('').then((data) => console.log(data)).catch((e) => console.log(e));
// getStateList('imagination land').then((data) => console.log(data)).catch((e) => console.log(e));
// getCityList('United Kingdom', 'England').then((data) => console.log(data)).catch((e) => console.log(e));
// getCityList('Albania', 'Berat').then((data) => console.log(data)).catch((e) => console.log(e));
// getPollutionData('United Kingdom', 'England', 'Oxford').then((data) => console.log(data)).catch((e) => console.log(e));
// getPollutionData('United Kingdom', 'England', 'Bristol').then((data) => console.log(data)).catch((e) => console.log(e));