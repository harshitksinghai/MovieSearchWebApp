import FavListFilter from './FavListFilter.tsx'
import { useTranslation } from 'react-i18next';
import ShowSavedList from '@/components/ShowSavedList.tsx'
import { Box, Typography } from '@mui/material';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider.tsx';
import { useFilteredFavorites } from '../hooks/useFilteredFavourites.tsx';

const Favourites = () => {
  console.log("Inside Favourites.tsx");
  const { t } = useTranslation();
  const { filteredList, loading } = useFilteredFavorites();


  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };
  
  const currentPalette = getCurrentPalette();

  
  console.log("Favourites.tsx => filteredFav output from filterFavourites selector", filteredList)
  
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
      <ShowSavedList filteredList={filteredList} loading={loading}/>
    </Box>
  )
}

export default Favourites