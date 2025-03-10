
import FavListFilter from './FavListFilter.tsx'
import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx'
import { Box, Typography, useTheme } from '@mui/material';
import { useAppSelector } from '../app/hooks.ts';
import { filterFavourites } from '../features/filter/filterSlice.ts';



const Favourites = () => {
  console.log("Inside Favourites.tsx");

  const {t} = useTranslation();
  const theme = useTheme();

  const filteredMovieList = useAppSelector(filterFavourites);

  return (
    <Box>
      <Typography 
        variant="h2" 
        sx={{
          fontWeight: 600,
          fontSize: '50px',
          textAlign: 'center',
          marginTop: '20px',
          color: theme.palette.text.flow
        }}
      >
        {t('fav.fav')}
      </Typography>
      <Box sx={{mt: '10px'}}>
        <FavListFilter />
      </Box>
      <ShowSavedList filteredList={filteredMovieList} />
    </Box>
  )
}

export default Favourites