import { useEffect, useState } from 'react';
import FavListFilter from './FavListFilter.tsx'
import { getMovieList, MovieItem } from '../utils/localStorage.ts';
import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx'
import { Box, Typography } from '@mui/material';

const Favourites = () => {
  const {t} = useTranslation();
  const [filteredMovieList, setFilteredMovieList] = useState<MovieItem[]>([]);
  const [activeType, setActiveType] = useState<string>("All");
  const [activeRating, setActiveRating] = useState<string>("");


  const refreshLists = () => {
    const list = getMovieList();
    
    let filtered = list.filter(movie => movie.addToWatchedList !== '');
    
    if (activeType !== "All") {
      filtered = filtered.filter(movie => movie.Type === activeType);
    }
    
    if (activeRating) {
      filtered = filtered.filter(movie => movie.ratingState === activeRating);
    }
    
    setFilteredMovieList(filtered);
  };

  useEffect(() => {
    refreshLists();
    const handleListChange = () => refreshLists();
    window.addEventListener('movieListChanged', handleListChange);
    return () => {
      window.removeEventListener('movieListChanged', handleListChange);
    };
  }, [activeType, activeRating]);

  const handleFilterChange = (ratingState: string, type: string) => {
    setActiveRating(ratingState);
    setActiveType(type);
  };

  return (
    <Box>
      <Typography 
        variant="h2" 
        sx={{
          fontWeight: 600,
          fontSize: '50px',
          textAlign: 'center',
          marginTop: '20px'
        }}
      >
        {t('fav.fav')}
      </Typography>
      <Box sx={{mt: '10px'}}>
        <FavListFilter onFilterChange={handleFilterChange} />
      </Box>
      <ShowSavedList filteredList={filteredMovieList} refreshList={refreshLists} />
    </Box>
  )
}

export default Favourites