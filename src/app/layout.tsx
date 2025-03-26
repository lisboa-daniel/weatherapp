'use client';


import "./globals.css";
import { Poppins } from "next/font/google";
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { WeatherProvider } from "./context/weatherContext";

const normalFont = Poppins({weight: '400', subsets: ['latin-ext']});

const theme = createTheme ({
  palette: {
  
    primary: {
      main: '#6925D6',
    },
    secondary: {
      main: '#2BBDB0',
    },
    error: {
      main: '#b74a4a',
    },
    info: {
      main: '#5645e2',
    },
    success: {
      main: '#a4c450',
    },
  },


});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WeatherProvider >
      <ThemeProvider theme={theme}>
      <html lang="en"> 
        <head>
          <meta property="og:image" content={'/logo.svg'} />
        </head>
        <body className={`flex flex-col min-h-dvh overflow-y-hidden ${normalFont.className}`}>
          {children}
        </body>
      </html>
      </ThemeProvider>
    </WeatherProvider>
  );
}
