import Country from "./Country";

interface CountriesResponse {
    message: string;
    data: Country[];
}

export default CountriesResponse;