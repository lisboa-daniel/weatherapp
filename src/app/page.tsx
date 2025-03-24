'use client';

import { Add, LocationOn, MoreVert, Thunderstorm } from "@mui/icons-material";
import { Button, CircularProgress, Divider, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useWeather } from "./context/weatherContext";
import { getLocNames, getData } from "./lib/actions";
import { getWeatherIcon } from "./lib/weatherIcons";
import { getDateComponents, getTodayFormated } from "./lib/utils";
import { WeatherPlace } from "./lib/definitions";

export default function Home() {
  const [sevendayForecasts, setSevendayForecasts] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  
  const { data, setData } = useWeather();
  const [isLoading, setIsLoading] = useState(true); // 🔹 Track loading state
  const [openMore, setOpenMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const today = getTodayFormated()
  const [locName, setLocName] = useState<{city : string, country : string } | undefined> (undefined);

  const [location, setLocation] = useState<WeatherPlace>({
    latitude: null,
    longitude: null,
    error: null,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMore(true);
  };

  const loadWeather = async (latitude : number = 0, longitude : number=0) => {
    setIsLoading(true);
    const fetchedData = await getData(latitude, longitude);
    const fetchlocName = await getLocNames(latitude, longitude);


    fetchedData.array.hourly.time.forEach((item: Date) => {
      console.log(item.getHours());
    });


    
    

    setLocName(fetchlocName);
    setData(fetchedData.data);

    
    setIsLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });

          loadWeather(position.coords.latitude,position.coords.longitude );
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.',
      });
    }

    
  }, []);

  return (
    <div className="flex flex-col items-center bg-white/60 p-2 m-2 rounded-xl z-[-1] h-[98dvh] md:p-4 md:m-4 justify-between">
      
   
      <div id='menuButton' className="flex w-full items-end justify-end">
        <Button sx={{ borderRadius: '72px', height: '64px' }}>
          <Add className="text-[#38a592]" sx={{ width: '32px', height: '32px' }}/>
        </Button>
        <div>
          <Button sx={{ borderRadius: '72px', height: '64px' }} onClick={(e) => handleClick(e)}>
            <MoreVert className="text-[#6ba198]" sx={{ width: '32px', height: '32px' }}/>
          </Button>
          <Menu anchorEl={anchorEl} open={openMore} onClose={() => setOpenMore(false)}>
            <MenuItem onClick={() => setOpenMore(false)}>Profile</MenuItem>
            <MenuItem onClick={() => setOpenMore(false)}>My account</MenuItem>
            <MenuItem onClick={() => setOpenMore(false)}>Logout</MenuItem>
          </Menu>
        </div>
      </div>

     
      <div id='cityInfo' className="flex flex-col">
        <span className="flex flex-row"> 
          <LocationOn className="text-[#38a592]" sx={{ width: '36px', height: '36px' }}/> 
          <p className="text-[#38a592] text-3xl font-extrabold">{
          
          (locName==undefined) ? 'Searching...' : locName.city + ", " + locName.country
          
          }</p>
        </span>
        <p className="text-[#38a592] text-xl">{today}</p>
      </div>


      <div id='mainInfo'>
        {isLoading ? ( 
          <CircularProgress />
        ) : (
          <>
            <p className="text-[145px] font-extrabold bg-gradient-to-r from-[#078f76] via-[#16b194] to-[#2ee6c4] max-h-[180px] text-transparent bg-clip-text">
              {data.temperature2m.toFixed(0)}º
            </p>
            <span className="w-full flex flex-row justify-start items-start">
              <p className="text-3xl font-extrabold bg-gradient-to-r from-[#078f76] via-[#16b194] to-[#2ee6c4] text-transparent bg-clip-text">
                {getWeatherIcon(data.weatherCode).name}
              </p>
              <img className="z-[2] md:w-[12rem] w-[8rem] right-[15%] top-[35%] drop-shadow-lg" 
                   src={`/icons/${getWeatherIcon(data.weatherCode).src}`} 
                   alt={getWeatherIcon(data.weatherCode).name}/>
            </span>
          </>
        )}
      </div>


      <div id='weatherdatail' className="rounded-4xl w-full flex flex-row bg-white/70 p-1 justify-center items-center">
        <span className="flex flex-col p-4 text-[#38a592] justify-center items-center">
          <Thunderstorm sx={{ width: '32px', height: '32px' }}/>
          <p className="font-bold">30%</p>
          <p className="font-thin">Precipitation</p>
        </span>
        <Divider orientation="vertical" flexItem />
        <span className="flex flex-col p-4 text-[#38a592] justify-center items-center">
          <Thunderstorm sx={{ width: '32px', height: '32px' }}/>
          <p className="font-bold">30%</p>
          <p className="font-thin">Precipitation</p>
        </span>
        <Divider orientation="vertical" flexItem/>
        <span className="flex flex-col p-4 text-[#38a592] justify-center items-center">
          <Thunderstorm sx={{ width: '32px', height: '32px' }}/>
          <p className="font-bold">30%</p>
          <p className="font-thin">Precipitation</p>
        </span>
      </div>

     
      <div id="sevendayforecast" className="flex flex-col w-full">
        <p className="text-left md:text-center w-full md:ml-0 ml-4 font-extrabold text-[#38a592] mb-2">7-Day Forecast</p>
        <div className="w-full flex flex-col p-2 overflow-x-auto justify-start items-start md:justify-center md:items-center">
          <div className="flex flex-row flex-nowrap">
            {sevendayForecasts.map((value, index) => (
              <span key={index} className="flex flex-col p-2 mr-2 bg-white/45 rounded-xl justify-center items-center text-[#38a592]">
                <p className="font-extrabold">{value}</p>
                <Thunderstorm sx={{ width: '2rem', height: '2rem' }}/>
                <p className="mt-1">21ºC</p>
                <p className="font-nm">14ºC</p>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
