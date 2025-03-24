import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../app/hooks.ts';
import { filterWatchLater } from '../features/filter/filterSlice.ts';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider.tsx';

const WatchLater = () => {
  console.log("Inside WatchLater.tsx");

  const {t} = useTranslation();

    const { currentTheme, darkMode } = useCustomTheme();
              const getCurrentPalette = () => {
                const palette = themePalettes[currentTheme];
                return darkMode ? palette.dark : palette.light;
              };
            
              const currentPalette = getCurrentPalette();

  const filteredMovieList = useAppSelector(filterWatchLater);

  return (
    <Box>
      <Typography 
        variant="h2" 
        sx={{
          fontWeight: 600,
          fontSize: 'clamp(2rem, 5vw, 3.125rem)', // Changed from fixed 50px
          textAlign: 'center',
          marginTop: '20px',
          color: currentPalette.textPrimary,
          pt: '2rem',
        }}
      >
        {t('watchLater.watchLater')}
      </Typography>
      <ShowSavedList filteredList={filteredMovieList} />
    </Box>
  )
}

export default WatchLater