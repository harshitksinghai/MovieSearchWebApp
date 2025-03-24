import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define theme options
export type ThemeName = 'Blue' | 'White' | 'Green';

// Color palettes based on provided links
export const themePalettes = {
  White: {
    light: {
      primary: '#222',
      secondary: '#555',
      background: '#ffffff',
      paper: '#f5f5f5',
      textPrimary: '#2f2f2f',
      textSecondary: '#525252',
      accent: '47, 47, 47',
      chartColors: ['#e0e0e0', '#ededed', '#f5f5f5', '#fff9ec', '#fff8dc', '#f3ead3']

    },
    dark: {
      primary: '#fff8dc',
      secondary: '#e0e0e0',
      background: '#222222',
      paper: '#2f2f2f',
      textPrimary: '#fff',
      textSecondary: '#f5f5f5',
      accent: '237, 237, 237',
      chartColors: ['#fff9ec', '#f3ead3', '#fff8dc', '#fbf5df', '#ededed', '#f5f5f5']

    }
  },
  Blue: {
    light: {
      primary: 'rgb(0, 33, 164)',
      secondary: '#1477d2',
      background: '#ffffff',
      paper: '#e6f0ff',
      textPrimary: '#0a1929',
      textSecondary: '#99c2ff',
      accent: '0, 102, 255',
      chartColors: ['#000033', '#00004d', '#000066', '#000080', '#003399', '#3366cc']
    },
    dark: {
      primary: '#1065c0',
      secondary: '#1a8ae5',
      background: '#0a1929',
      paper: '#02a43',
      textPrimary: '#ffffff',
      textSecondary: '#99c2ff',
      accent: '102, 163, 255',
      chartColors: ['#e6f7ff', '#ccefff', '#b3e6ff', '#99d6ff', '#80cfff', '#66c2ff']
    }
  },
  Green: {
    light: {
      primary: 'rgb(11, 78, 30)',
      secondary: '#008000',
      background: '#ffffff',
      paper: '#e6ffe6',
      textPrimary: 'rgb(0, 50, 14)',
      textSecondary: '#66cc66',
      accent: '0, 179, 0',
      chartColors: ['#003300', '#004d00', '#006600', '#008000', '#339933', '#66b266']


    },
    dark: {
      primary: '#66cc66',
      secondary: '#33b333',
      background: '#071b07',
      paper: '#0e2e0e',
      textPrimary: '#ffffff',
      textSecondary: '#99e699',
      accent: '102, 204, 102',
      chartColors: ['#f2fff2', '#e6ffe6', '#d9ffd9', '#ccffcc', '#b3ffb3', '#99ff99']

    }
  },
};

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  currentTheme: ThemeName;
  setCurrentTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useCustomTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  // Load darkMode preference from localStorage on component mount
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Load theme preference from localStorage
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('themeName') as ThemeName;
    return savedTheme && Object.keys(themePalettes).includes(savedTheme) 
      ? savedTheme 
      : 'Blue'; // Default theme
  });

  const availableThemes: ThemeName[] = [
    'Blue', 'White', 'Green'
  ];

  // Toggle darkMode and save preference to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Set theme and save preference to localStorage
  const handleSetCurrentTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('themeName', themeName);
  };

  // Get current palette based on theme and mode
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  // Create MUI theme based on currentTheme and darkMode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: getCurrentPalette().primary,
      },
      secondary: {
        main: getCurrentPalette().secondary,
      },
      background: {
        default: getCurrentPalette().background,
        paper: getCurrentPalette().paper,
      },
      text: {
        primary: getCurrentPalette().textPrimary,
        secondary: getCurrentPalette().textSecondary,
      },
    },
  });

  useEffect(() => {
    document.body.style.backgroundColor = getCurrentPalette().background;
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [darkMode, currentTheme]);

  const value = {
    darkMode,
    toggleDarkMode,
    theme,
    currentTheme,
    setCurrentTheme: handleSetCurrentTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};