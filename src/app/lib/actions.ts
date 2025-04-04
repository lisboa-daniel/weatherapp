'use server';

import { fetchWeatherApi } from 'openmeteo';
import { City, CurrentData, DayData, HourData, NewWeather, Weather, WeatherCompleteData, WeatherReadble } from './definitions';
import { headers } from 'next/headers';

import dotenv from "dotenv";

export async function getGeoUsername() {
  console.log("server env test:", process.env.GEONAMES_USERNAME);
  return process.env.GEONAMES_USERNAME;
}

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



export async function searchCity(q: string, country: string) {
  try {

    const GEONAMES_USERNAME =  process.env.NEXT_PUBLIC_GEONAMES_USERNAME;
    
    console.log(`http://api.geonames.org/searchJSON?q=${encodeURIComponent(q)}&maxRows=10&username=${GEONAMES_USERNAME}&country=${encodeURIComponent(country)}`);

    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${encodeURIComponent(q)}&maxRows=10&username=${GEONAMES_USERNAME}&country=${encodeURIComponent(country)}`
    );



    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    let results : City[] = []
    data.geonames.forEach((value : any) => {
        results.push(
          {
            adminName1: value.adminName1,
            name : value.name,
            lat: value.lat,
            lng: value.lng
          }
        )
    });

    return results;

  } catch (err) {
    throw err;
  }
}

export async function getLocNames(latitude: number = 0, longitude: number = 0): Promise<{ city: string, country: string  } | undefined> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_APIKEY; // Replace with your actual API key if needed
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


export async function getWeatherData(latitude : number = 0, longitude : number = 0) : Promise<WeatherReadble | undefined>{
    
  let data : WeatherCompleteData | undefined = undefined;

  const url = "https://api.open-meteo.com/v1/forecast";

  const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const params = {
      "latitude": latitude,
      "longitude": longitude,
      "daily": ["weather_code", "temperature_2m_min", "temperature_2m_max"],

      "hourly": ["temperature_2m", "weather_code", "precipitation_probability", "wind_speed_10m", "relative_humidity_2m"],
      
      "current": ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m", "relative_humidity_2m","rain","precipitation_probability"],
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



  const hourlyData : HourData[] = [];
  const dailyData : DayData[] = [];
  const currentData : CurrentData = {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      precipitation: current.variables(1)!.value(),
      weatherCode: current.variables(2)!.value(),
      windSpeed10m: current.variables(3)!.value(),
      relativeHumidity2m: current.variables(4)!.value(),
      rain: current.variables(5)!.value(),
      precipitation_probability: current.variables(6)!.value(),
    }
  


  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  for (let i = 0; i < data.hourly.time.length; i++) {
     
    hourlyData.push({
      time: data.hourly.time[i],
      temperature2m: data.hourly.temperature2m[i],
      weatherCode: data.hourly.weatherCode[i],
      precipitationProbability: data.hourly.precipitationProbability[i],
      windSpeed10m: data.hourly.windSpeed10m[i],
      relativeHumidity2m: data.hourly.relativeHumidity2m[i]

     });
          
      
  }
  for (let i = 0; i < data.daily.time.length; i++) {
      dailyData.push({
        time: data.daily.time[i],
        weatherCode: data.daily.weatherCode[i],
        temperature2mMin: data.daily.temperature2mMin[i],
        temperature2mMax: data.daily.temperature2mMax[i]
      })
          
     
  }

  
  const _data : WeatherReadble = {

    current: currentData,
    hourly: hourlyData,
    daily: dailyData
  }
  return _data;

}



export async function getUserLocation(): Promise<City | undefined> {
  const apiKey = process.env.NEXT_PUBLIC_IPGEOLOCATION_APIKEY;
  if (!apiKey) return undefined;

  // First, fetch the real user IP!
  const ipRes = await fetch('https://api.ipgeolocation.io/getip');
  const ipData = await ipRes.json();
  const ip = ipData.ip;

  console.log(`IP is ${ip}`);

  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}&fields=city,latitude,longitude,state_prov`;

  const res = await fetch(url);
  const data = await res.json();

  const { city, latitude, longitude, state_prov } = data;

  return {
    adminName1: state_prov,
    name: city,
    lat: latitude,
    lng: longitude,
  };
}