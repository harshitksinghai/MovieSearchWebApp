import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext.tsx';

declare module "@mui/material/styles" {
  interface TypeBackground {
    iconBg: string;
    transparentBg: string;
    cardOverlay: string;
    nav: string;
    footer: string;
    flow: string;
    flowHover: string;
  }
  interface Palette {
    watchLaterIcon: string;
    watchedIcon: string;
    svgColor: string;
    iconColor: string;
    ratingButton: {
      border: string;
      activeBorder: string;
      background: string;
      activeBackground: string;
      hoverBorder: string;
    };
    detailsBox: {
        bgColor: string;
        textPrimary: string;
        textSecondary: string;
        topicColor: string;
        boxShadow: string;
    };
    pagination: {
      activebg: string;
      activeColor: string;
      color: string;
    };
  }
  interface PaletteOptions {
    watchLaterIcon?: string;
    watchedIcon?: string;
    svgColor?: string;
    iconColor?: string;
    ratingButton?: {
      border?: string;
      activeBorder?: string;
      background?: string;
      activeBackground?: string;
      hoverBorder?: string;
    };
    detailsBox?: {
        bgColor?: string;
        textPrimary?: string;
        textSecondary?: string;
        topicColor?: string;
        boxShadow?: string;
    };
    pagination?: {
      activebg?: string;
      activeColor?: string;
      color?: string;
    };
  }
  interface TypeText {
    flow?: string;
    support?: string;
  }
}

const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });
  
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  }
  
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#fff' : '#000', // White in dark mode, Black in light mode
        },
        secondary: {
          main: darkMode ? '#2f2f2f' : '#e0e0e0', // Button background colors
        },
        background: {
          default: darkMode ? '#222' : '#fff',
          paper: darkMode ? '#18181b' : '#ffffff',
          iconBg: darkMode ? "#2f2f2f" : "#e0e0e0",
          transparentBg: darkMode ? "rgba(24, 24, 27, 0.9)" : "rgba(255, 255, 255, 0.9)",
          cardOverlay: darkMode ? "#f5f5f5" : "#181818",
          nav: "#ededed",
          footer: darkMode ? "#333" : "#ededed",
          flow: darkMode ? "#fff" : "#222",
          flowHover: darkMode ? '#e0e0e0' : '#333'
        },
        text: {
          primary: '#222',
          secondary: darkMode ? '#222' : '#fff',
          flow: darkMode ? "#fff" : "#222",
          support: darkMode ? '#ccc' : '#666',
        },
        watchLaterIcon: darkMode ? "#FFFFFF" : "#222",
        watchedIcon: darkMode ? "#FFFFFF" : "#222",
        svgColor: darkMode ? "#ffffff" : "#181818",
        iconColor:  darkMode ? '#000' : '#fff',
        ratingButton: {
          border: darkMode ? '#d5d5d5' : '#636363',
          activeBorder: darkMode ? '2f2f2f' : 'white',
          background: darkMode ? '#ededed' : '#2f2f2f',
          activeBackground: darkMode ? '#2f2f2f' : 'white',
          hoverBorder: darkMode ? '#2f2f2f' : '#ffffff',
        },
        detailsBox: {
            bgColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            textPrimary: darkMode ? '#e0e0e0' : '#333',
            textSecondary: darkMode ? '#bbb' : '#666',
            topicColor: '#ff9800',
            boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        pagination: {
          activebg: darkMode ? "#fff" : "#222",
          activeColor: darkMode ? "#222" : "#fff",
          color: darkMode ? "#fff" : "#222",
        }
      },
      typography: {
        fontFamily: "'Poppins', sans-serif",
        button: {
          textTransform: 'none',
        },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#222' : '#ffffff',
              borderRadius: 8,
              overflow: 'visible',
              transition: 'all 0.3s ease',
              boxShadow: darkMode 
                ? '2px 2px 10px rgba(26, 26, 26, 0.495)'
                : '0px 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
                zIndex: 10,
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              transition: 'all 0.2s ease',
            },
          },
        },
      },
    }),
    [darkMode]
  );
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;