'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { NewWeather, WeatherReadble } from '@/app/lib/definitions';

// Define the type for the context value
export interface WeatherContextType {
  data: WeatherReadble | undefined,
  setData : (w: WeatherReadble | undefined) => void

}

// Create the context with an initial value of undefined
export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Define the provider props type
interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [data, setData] = useState<WeatherReadble | undefined>(undefined);


  return (
    <WeatherContext.Provider value={{ data, setData }}>
      {children}
    </WeatherContext.Provider>
  );
}


// Custom hook to use the Command context
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useCommand must be used within an WeatherProvider');
  }
  return context;
}
