import { fetchWeatherApi } from 'openmeteo';
import { NewWeather, Weather } from './definitions';
	
const params = {
	"latitude": -23.669312,
	"longitude": -46.461332,
	"hourly": ["temperature_2m", "precipitation", "weather_code"],
    "timezone": "America/Sao_Paulo"
};
const url = "https://api.open-meteo.com/v1/forecast";


// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);


export async function getData() : Promise<Weather>{
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData : any = {

        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            precipitation: hourly.variables(1)!.valuesArray()!,
            weatherCode: hourly.variables(2)!.valuesArray()!,
        },

    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        
        const today = new Date().getHours();

        if (weatherData.hourly.time[i].getHours() === today) {
            console.log(`hour now: ${today.toLocaleString()}, hour get:${weatherData.hourly.time[i].getHours().toLocaleString()}`);
            return {
                time: weatherData.hourly.time[i],
                temperature2m: weatherData.hourly.temperature2m[i],
                precipitation: weatherData.hourly.precipitation[i],
                weatherCode: weatherData.hourly.weatherCode[i],
                
            }
                
        }
        
    }

    return NewWeather();
}


