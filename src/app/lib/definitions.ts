export type Weather = {
    time: Date[];
    temperature2m: number;
    precipitation: number;
    weatherCode: number;
}


export function NewWeather() : Weather{
    return {

        time: [new Date('2025-03-21')],
        temperature2m: 0,
        precipitation: 0,
        weatherCode: 0
        
    };
}