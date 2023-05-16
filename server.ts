import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getCountryList() : Promise<string[]> {

    const response = await axios.get(`http://api.airvisual.com/v2/countries?key=${process.env.AIRVISUAL_API_KEY}`);

    return ['Australia', 'Argentina'];
}