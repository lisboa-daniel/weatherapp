'use client';

import { Add, Air, ArrowDropDown, ArrowDropDownRounded, LocationOn, MoreVert, Thunderstorm, WaterDropOutlined } from "@mui/icons-material";
import { Button, CircularProgress, Divider, Menu, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useWeather } from "./context/weatherContext";
import { getLocNames, getData, getWeatherData } from "./lib/actions";
import { getWeatherIcon } from "./lib/weatherIcons";
import { getDateComponents, getTodayFormated } from "./lib/utils";
import { City, WeatherPlace } from "./lib/definitions";
import FindCityModal from "./ui/findCityModal";
import { Poppins } from "next/font/google";
import HourlyGraph from "./ui/hourlyGraph";

const normalFont = Poppins({weight: '400', subsets: ['latin-ext']});


export default function Home() {
  const weekday = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date().getDay();
  
  
  
  const { data, setData } = useWeather();
  
  const [isLoading, setIsLoading] = useState(true); // 🔹 Track loading state
  const [openMore, setOpenMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [openCity, setOpenCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>();


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

  const handleSelectCity = async () => {
    setIsLoading(true);
    loadWeather(selectedCity?.lat, selectedCity?.lng);
  }

  const loadWeather = async (latitude : number = 0, longitude : number=0) => {
    setIsLoading(true);
    const fetchedData = await getData(latitude, longitude);
    const fetchedData2 = await getWeatherData(latitude, longitude);
    const fetchlocName = await getLocNames(latitude, longitude);


    // fetchedData.array.hourly.time.forEach((item: Date) => {
    //   console.log(item.getHours());
    // });
    
    

    setLocName(fetchlocName);
    setData(fetchedData2);
 
    
    setIsLoading(false);
  };

  useEffect( () => {
    if (selectedCity)
      handleSelectCity();

  }, [selectedCity]);

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
    <main className={`flex flex-col bg-gradient-to-br to-white/10 from-white/30 rounded-xl h-[98dvh] justify-between  border-[#f3f8fb] border-[1px] overflow-y-clip overflow-x-clip m-2 md:m-0 transition-opacity ease-in duration-700 ${true ? "opacity-100" : "opacity-0"}`} style={{
     
    }}>
      <FindCityModal handleSetCity={setSelectedCity} handleClose={() => setOpenCity(false)} open={openCity} />
      <div id='maincontent' className="flex flex-col justify-between items-center snap-start min-h-dvh ">
        <div className="flex flex-col justify-between items-center bg-gradient-to-br to-white/20 from-white/40 rounded-xl p-2 w-full border-white drop-shadow-[0_4px_4px_rgba(28,69,108,0.5)] border-b-[1px]">
          <div id='menuButton' className="flex w-full items-end justify-end">

            <div>
              <Button aria-label="Options" sx={{ borderRadius: '72px', height: '64px' }} onClick={(e) => handleClick(e)}>
                <MoreVert className="text-primary-600" sx={{ width: '32px', height: '32px' }}/>
              </Button>
              <Menu anchorEl={anchorEl} open={openMore} onClose={() => setOpenMore(false)}>
                <MenuItem onClick={(e) => {setOpenCity(true); setOpenMore(false) }}>Change City</MenuItem>

              </Menu>
            </div>
          </div>

        
          <div id='cityInfo' className="flex flex-col">
          <div onClick={() => setOpenCity(true)}>
        
              <div className="flex flex-row"> 
                <LocationOn className="text-primary-600" sx={{ width: '36px', height: '36px' }}/> 
                <p className="text-primary-600 text-3xl font-extrabold">{
                
                (locName==undefined || isLoading) ? 'Searching...' : locName.city + ", " + locName.country
                
                }</p>
              </div>
          </div>
            <p className={`text-primary-600 text-xl `}>{getTodayFormated()}</p>
          </div>


          <div id='mainInfo' className="flex flex-col justify-cente items-center mb-2">
            {isLoading ? ( 
              <CircularProgress />
            ) : (
              <>
                <p className="text-[160px] font-extrabold bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 max-h-[180px] text-transparent bg-clip-text">
                  {data?.current.temperature2m.toFixed(0)}º
                </p>
                <span className="relative w-full flex flex-row justify-start items-start">
                  <p className="mr-[6rem] text-3xl font-extrabold bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 text-transparent bg-clip-text">
                    {getWeatherIcon(data?.current.weatherCode).name}
                  </p>
                  <img className="absolute top-[-5rem] md:top-[-7rem] z-[2] md:w-[10rem] w-[6rem] md:right-[-40%] right-[-8%] drop-shadow-[0_35px_35px_rgba(28,69,108,0.5)]  ]" 

                      src={`/icons/${getWeatherIcon(data?.current.weatherCode).src}`} 
                      alt={getWeatherIcon(data?.current.weatherCode).name}/>
                </span>
              </>
            )}
          </div>


          <div id='weatherdatail' className="rounded-4xl w-full flex flex-row bg-gradient-to-br to-white/40 from-white/80 p-1 justify-center items-center mt-8 drop-shadow-[0_8px_8px_rgba(28,69,108,0.25)] border-t-[2px] border-[1px] border-white mb-2">
            <span className="flex flex-col pl-4 pr-4 pt-1 pb-1 text-primary-600 justify-center items-center">
              <WaterDropOutlined sx={{ width: '32px', height: '32px' }}/>
              <p className="font-bold">{data?.current.relativeHumidity2m}%</p>
              <p className="font-thin text-sm">Umidity</p>
            </span>
            <Divider orientation="vertical" flexItem />
            <span className="flex flex-col pl-4 pr-4 pt-1 pb-1 text-primary-600 justify-center items-center">
              <Thunderstorm sx={{ width: '32px', height: '32px' }}/>
              <p className="font-bold">{data?.current.precipitation_probability}%</p>
              <p className="font-thin">Precipitation</p>
            </span>
            <Divider orientation="vertical" flexItem/>
            <span className="flex flex-col pl-4 pr-4 pt-1 pb-1 text-primary-600 justify-center items-center">
              <Air sx={{ width: '32px', height: '32px' }}/>
              <p className="font-bold">{data?.current.windSpeed10m.toFixed(2)}kmh</p>
              <p className="font-thin">Wind</p>
            </span>
          </div>
        </div>   


          <div id="sevendayforecast" className="flex flex-col w-full">
            <p className="text-left md:text-center w-full md:ml-0 ml-4 font-extrabold text-primary-600 mt-2 mb-2">7-Day Forecast</p>
            <div className="w-full flex flex-col p-2 overflow-x-auto justify-start items-start md:justify-center md:items-center">
              <div className="flex flex-row flex-nowrap">
                {data?.daily.map((value, index) => (
                  <span key={index} className={`flex flex-col p-2 mr-2 bg-gradient-to-t to-primary-700 from-primary-400 rounded-xl justify-center items-center text-white drop-shadow-[0_4px_4px_rgba(28,69,108,0.75)]  ${(today == value.time.getUTCDay()) ?  'border-amber-300 border-[4px]':'border-[1px] border-primary-200  border-t-[2px]'}`}>
                    <p className="font-extrabold text-primary-300">{weekday[value.time.getUTCDay()]}</p>
                    {/* <Thunderstorm sx={{ width: '2rem', height: '2rem' }}/> */}
                    <img className="drop-shadow-[1_8px_8px_rgba(11,87,208,1)]" 

                        src={`/icons/${getWeatherIcon(value.weatherCode).src}`} 
                        alt={getWeatherIcon(value.weatherCode).name}/>

                    <p className="mt-1 font-bold text-[#f1b901]">{value.temperature2mMax.toFixed(0)}ºC</p>
                    <p className="font-nm">{value.temperature2mMin.toFixed(0)}ºC</p>
                  </span>
                ))}
              </div>
            </div>
          </div> 
          
          {/*!isLoading && <HourlyGraph/>*/}
        
          <ArrowDropDownRounded className="text-transparent" sx={{ width:'64px', height:'64px'}}/>
        </div>     
     
    </main>
  );
}
