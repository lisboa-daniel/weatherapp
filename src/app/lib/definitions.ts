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

export type WeatherCompleteData = {
    current : {
        time : Date,
        temperature2m : number,
        precipitation : number,
        weatherCode : number,
        windSpeed10m : number,
        relativeHumidity2m : number
    },

    hourly: {
        time: Date[],
        temperature2m: Float32Array,
        precipitationProbability: Float32Array,
        weatherCode : Float32Array
		windSpeed10m: Float32Array,
		relativeHumidity2m: Float32Array,
    },

    daily : {
		time: Date[],
		weatherCode: Float32Array,
		temperature2mMin:Float32Array,
		temperature2mMax: Float32Array,
    }
}


export type WeatherReadble = {
    daily : DayData[],
    hourly : HourData[],
    current : CurrentData
}

export type DayData = {
    time : Date,
    weatherCode : number,
    temperature2mMin : number,
    temperature2mMax : number
}

export type HourData = {
    time: Date,
    temperature2m: number,
    precipitationProbability: number,
    weatherCode : number
    windSpeed10m: number,
    relativeHumidity2m: number,
}

export type CurrentData = {
    time : Date,
    temperature2m : number,
    precipitation : number,
    weatherCode : number,
    windSpeed10m : number,
    relativeHumidity2m : number
    rain : number
    precipitation_probability : number
}