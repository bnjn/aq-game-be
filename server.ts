import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getCountryList() : Promise<string[]> {
    const response = await axios.get(`https://api.airvisual.com/v2/countries?key=${process.env.AIRVISUAL_API_KEY}`);
    if (response.status.toString() !== 'success') {
        throw new Error(`Error status from AirVisual API: ${response.status.toString()}`);
    }
    return response.data.map((country: { country: object }) => country.country);
}

export async function getStateList(country: string) : Promise<string[]> {
    return ['Beijing'];
}