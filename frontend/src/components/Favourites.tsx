
import FavListFilter from './FavListFilter.tsx'
import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx'
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../app/hooks.ts';
import { filterFavourites } from '../features/filter/filterSlice.ts';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider.tsx';


const Favourites = () => {
  console.log("Inside Favourites.tsx");

  const { t } = useTranslation();

  const { currentTheme, darkMode } = useCustomTheme();
            const getCurrentPalette = () => {
              const palette = themePalettes[currentTheme];
              return darkMode ? palette.dark : palette.light;
            };
          
            const currentPalette = getCurrentPalette();

  const filteredMovieList = useAppSelector(filterFavourites);
  console.log("Favourites.tsx => filteredFav output from filterFavourites selector", filteredMovieList)
  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 600,
          fontSize: '50px',
          textAlign: 'center',
          marginTop: '20px',
          color: currentPalette.textPrimary,
          pt: '2rem',
        }}
      >
        {t('fav.fav')}
      </Typography>
      <Box sx={{ mt: '10px' }}>
        <FavListFilter />
      </Box>
      <ShowSavedList filteredList={filteredMovieList} />
    </Box>
  )
}

export default Favourites