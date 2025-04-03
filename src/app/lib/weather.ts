import { fetchWeatherApi } from 'openmeteo';
import { NewWeather, Weather, WeatherCompleteData } from './definitions';


export async function getWeatherData(latitude : number = 0, longitude : number = 0) : Promise<WeatherCompleteData | undefined>{
    
    let data : WeatherCompleteData | undefined = undefined;

    const url = "https://api.open-meteo.com/v1/forecast";

    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["weather_code", "temperature_2m_min", "temperature_2m_max"],

        "hourly": ["temperature_2m", "weather_code", "precipitation_probability", "wind_speed_10m", "relative_humidity_2m"],
        
        "current": ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m", "relative_humidity_2m"],
        "timezone": "America/Sao_Paulo"
    };


    const responses = await fetchWeatherApi(url, params);


    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const _latitude = response.latitude();
    const _longitude = response.longitude();
    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;


    data = {

        current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
        precipitation: current.variables(1)!.value(),
        weatherCode: current.variables(2)!.value(),
        windSpeed10m: current.variables(3)!.value(),
        relativeHumidity2m: current.variables(4)!.value(),
        },
        hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        weatherCode: hourly.variables(1)!.valuesArray()!,
        precipitationProbability: hourly.variables(2)!.valuesArray()!,
        windSpeed10m: hourly.variables(3)!.valuesArray()!,
        relativeHumidity2m: hourly.variables(4)!.valuesArray()!,
        },

                daily: {
        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        weatherCode: daily.variables(0)!.valuesArray()!,
        temperature2mMin: daily.variables(1)!.valuesArray()!,
        temperature2mMax: daily.variables(2)!.valuesArray()!,
        }
    }

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < data.hourly.time.length; i++) {
        console.log(
            data.hourly.time[i].toISOString(),
            data.hourly.temperature2m[i],
            data.hourly.weatherCode[i],
            data.hourly.precipitationProbability[i],
            data.hourly.windSpeed10m[i],
            data.hourly.relativeHumidity2m[i]
        );
    }
    for (let i = 0; i < data.daily.time.length; i++) {
        console.log(
            data.daily.time[i].toISOString(),
            data.daily.weatherCode[i],
            data.daily.temperature2mMin[i],
            data.daily.temperature2mMax[i]
        );
    }

    return data;

}




