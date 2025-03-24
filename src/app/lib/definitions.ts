export interface WeatherPlace {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
  }

export type Weather = {
    time: Date[];
    temperature2m: number;
    precipitation: number;
    weatherCode: number;
}

export type WeatherArray =  {
    hourly: {
        time: [],
        temperature2m: Float32Array,
        precipitation:  Float32Array,
        weatherCode: Float32Array
    }
}

export function NewWeather() : Weather{
    return {

        time: [new Date('2025-03-21')],
        temperature2m: 0,
        precipitation: 0,
        weatherCode: 0
        
    };
}

