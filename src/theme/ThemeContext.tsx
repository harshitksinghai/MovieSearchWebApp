import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
 
export const ThemeContext = createContext({
    darkMode: true,
    toggleTheme: () => { }
});
 
const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);
 
    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    }
 
    const theme = useMemo(
        () => createTheme({
            palette: {
                mode: darkMode ? 'dark' : 'light',
                // primary: {
                //     main: darkMode ? '#fff' : '#fff',
                // },
                // secondary: {
                //     main: darkMode ? '#fff' : '#fff',
                // },
                background: {
                    default: darkMode ? '#222' : '#FFFFFF',
                    paper: darkMode ? '#1E1E1E' : '#F5F5F5',
                },
                text: {
                    primary: darkMode ? '#fff' : '#212121',
                    secondary: darkMode ? '#222' : '#222'
                },
            },
            typography: {
                fontFamily: "'Poppins', sans-serif",
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