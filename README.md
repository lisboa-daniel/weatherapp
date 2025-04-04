## Simple Weather App

This is a simple weather app you are able to check information of weather of your city, see the current temperature, wind speed, umidity and precipation of rain.
You are able to share the location through browser permission or set the location with the change city button.
Also a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Weather info
Weather info is powered by [Open Meteo](https://open-meteo.com/) a free open source weather API
City names searched by latitude and longitude is powered by [GeoApify](https://www.geoapify.com/) API with free tier plan
City search engine is powered by [Geonames](https://www.geonames.org/) free API 


## Guide to run this
1. Clone the repo and install the dependencies:

```bash
npm install
```

2. Create a .env file with this entries:
```bash
NEXT_PUBLIC_GEONAMES_USERNAME=your_geonames_username
NEXT_PUBLIC_GEOAPIFY_APIKEY=yourgeoapify_apikey
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo
A demo page is deployed at vercel in [WeatherApp](https:myverycoolweatherapp.vercel.app)
