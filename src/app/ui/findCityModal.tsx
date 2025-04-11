'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete, CircularProgress, Input, InputLabel, LinearProgress, List, ListItemButton, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useState, useRef } from 'react';
import { getCountriesList } from '../lib/utils';
import { Poppins } from 'next/font/google';
import { searchCity } from '../lib/actions';
import { City } from '../lib/definitions';

const normalFont = Poppins({weight: '400', subsets: ['latin-ext']});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  outline: 'none',
  p: 4,
};

interface FindCityModalProps {
    open : boolean;
    handleClose : () => void;
    handleSetCity : ( city : City) => void;
}

export default function FindCityModal( {open, handleClose, handleSetCity} : FindCityModalProps ) {

  const optionSelect = (c : City) => {
    handleSetCity(c);
    handleClose();
  }

  const [country, setCountry] = useState(0);
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState<string>("");
  const [qCities, setQCities] = useState<City[]> ([]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const findCity = async (query : string) => {
    // Make sure we only call the API once after 1500ms delay
    const cities = await searchCity(query, getCountriesList()[country].code);
    setQCities(cities);



    setLoading(false)
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setLoading(true);
    
    const newCity = event.target.value;
    setCity(newCity);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current); // Clear the previous timeout if it exists
    }

    debounceTimeoutRef.current = setTimeout(() => {
      findCity(newCity);

    }, 1200); // Delay API call by 1500ms
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex flex-col p-2 justify-between item-center'>
            <h1 className='text-2xl text-primary-500 font-bold'>Change your location</h1>
            
            <InputLabel sx={{marginBottom: '3px'}} id="demo-simple-select-label">Country (Optional)</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              type='text'
              label="Age"
              sx={{marginBottom: '8px'}}
              onChange={(event) => setCountry(event.target.value as number)}
            >
              {getCountriesList().map( (value, index) => (
                 <MenuItem value={index} key={index}>{value.name}</MenuItem>
              ))}
            </Select>
            
            <span className='flex flex-row w-full items-center justify-center'>
              <TextField 
                value={city} 
                onChange={handleCityChange} 
                sx={{width: '100%'}} 
                id="outlined-basic" 
                label="City" 
                variant="outlined" 
              />
              {/* <button 
                className={`bg-primary p-2 cursor-pointer text-white font-bold rounded w-[56px] h-[56px] ${normalFont.className}`} 
                onClick={() => findCity(city)}
              >
                FIND
              </button> */}
            </span>
            
            {!loading && <List>
              {qCities.map( (value, index) => (
                <ListItemButton onClick={() => optionSelect(value)} key={index}>
                  {value.name + " - " + value.adminName1}
                </ListItemButton>
              ))}
            </List> }

            { loading && <LinearProgress className='mt-2 mb-2'/>}

            {(qCities.length == 0 && !loading && city!="") && <p>Results not found, try other query</p>}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
