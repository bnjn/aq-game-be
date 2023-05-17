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

// Live API tests
// getCountryList().then((data) => console.log(data)).catch(e => console.log(e))
// getStateList('United Kingdom').then((data) => console.log(data)).catch((e) => console.log(e));
// getStateList('China').then((data) => console.log(data)).catch((e) => console.log(e));
// getStateList('').then((data) => console.log(data)).catch((e) => console.log(e));
// getStateList('imagination land').then((data) => console.log(data)).catch((e) => console.log(e));