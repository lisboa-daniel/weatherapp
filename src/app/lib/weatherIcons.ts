const weatherIcons: Record<number, { src: string; name: string }> = {
  0: { src: "clear_day.svg", name: "Clear Sky" },

  1: { src: "mostly_clear_day.svg", name: "Mainly Clear" },
  2: { src: "partly_cloudy_day.svg", name: "Partly Cloudy" },
  3: { src: "cloudy.svg", name: "Overcast" },

  45: { src: "haze_fog_dust_smoke.svg", name: "Fog" },
  48: { src: "haze_fog_dust_smoke.svg", name: "Depositing Rime Fog" },

  51: { src: "drizzle.svg", name: "Light Drizzle" },
  53: { src: "drizzle.svg", name: "Moderate Drizzle" },
  55: { src: "drizzle.svg", name: "Dense Drizzle" },

  56: { src: "icy.svg", name: "Light Freezing Drizzle" },
  57: { src: "icy.svg", name: "Dense Freezing Drizzle" },

  61: { src: "showers_rain.svg", name: "Slight Rain" },
  63: { src: "rain_with_cloudy_light.svg", name: "Moderate Rain" },
  65: { src: "rain_with_cloudy_dark.svg", name: "Heavy Rain" },

  66: { src: "icy.svg", name: "Light Freezing Rain" },
  67: { src: "icy.svg", name: "Heavy Freezing Rain" },

  71: { src: "snow_with_cloudy_light.svg", name: "Slight Snowfall" },
  73: { src: "snow_with_cloudy_dark.svg", name: "Moderate Snowfall" },
  75: { src: "heavy_snow.svg", name: "Heavy Snowfall" },

  77: { src: "flurries.svg", name: "Snow Grains" },

  80: { src: "scattered_showers_day.svg", name: "Slight Rain Showers" },
  81: { src: "rain_with_sunny_light.svg", name: "Moderate Rain Showers" },
  82: { src: "rain_with_sunny_dark.svg", name: "Violent Rain Showers" },

  85: { src: "scattered_snow_showers_day.svg", name: "Slight Snow Showers" },
  86: { src: "scattered_snow_showers_night.svg", name: "Heavy Snow Showers" },

  95: { src: "isolated_scattered_thunderstorms_day.svg", name: "Thunderstorm" },
  96: { src: "strong_thunderstorms.svg", name: "Thunderstorm with Slight Hail" },
  99: { src: "strong_thunderstorms.svg", name: "Thunderstorm with Heavy Hail" },
};

// Function to get the weather icon & name safely
export const getWeatherIcon = (code: number | undefined) => {
  if (code)
    return weatherIcons[code] || { src: "umbrella.svg", name: "Unknown Weather" }; // Fallback
  return { src: "umbrella.svg", name: "Unknown Weather" }; 
};

export default weatherIcons;
