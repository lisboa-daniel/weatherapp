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


export async function getLocNames(latitude: number = 0, longitude: number = 0): Promise<{ city: string, country: string  } | undefined> {
    try {
      const apiKey = 'a2d63b4294cf40eabf1589bc823da32d'; // Replace with your actual API key if needed
      const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
  
      const response = await fetch(apiUrl, { method: 'GET' });
  
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return undefined; // Or throw an error if you prefer
      }
  
      const result = await response.json();
  
      if (result && result.features && result.features.length > 0 && result.features[0].properties && result.features[0].properties.city) {
        
        return { city: result.features[0].properties.city, country:  result.features[0].properties.country};
      } else {
        console.warn('City not found in the API response.');
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return undefined;
    }
  }

export async function getData(latitude : number = 0, longitude : number = 0) : Promise<{data: Weather, array : any}>{
    params.latitude = latitude;
    params.longitude = longitude;
    const responses = await fetchWeatherApi(url, params);

    console.log(`processing for lat: ${latitude} lon:${longitude}`);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const _latitude = response.latitude();
    const _longitude = response.longitude();
    response.locationId

    const hourly = response.hourly()!;
    const current = response.current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherDataArray : any = {

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
    for (let i = 0; i < weatherDataArray.hourly.time.length; i++) {
        
        const today = new Date().getHours();

        if (weatherDataArray.hourly.time[i].getHours() === today) {
            console.log(`hour now: ${today.toLocaleString()}, hour get:${weatherDataArray.hourly.time[i].getHours().toLocaleString()}`);
            return {
                data:{
                    time: weatherDataArray.hourly.time[i],
                    temperature2m: weatherDataArray.hourly.temperature2m[i],
                    precipitation: weatherDataArray.hourly.precipitation[i],
                    weatherCode: weatherDataArray.hourly.weatherCode[i],
                },

                array: weatherDataArray
                
                
            }
                
        }
        
    }

    return {
        data: NewWeather(),
        array: []
    }
}


