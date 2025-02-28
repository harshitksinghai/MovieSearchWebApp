import { useEffect, useState } from 'react';
import { getMovieList, MovieItem } from '../utils/localStorage.ts';
import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx';
import { Box, Typography } from '@mui/material';

const WatchLater = () => {
  const {t} = useTranslation();
  const [filteredMovieList, setFilteredMovieList] = useState<MovieItem[]>([]);

  const refreshLists = () => {
    const list = getMovieList();
    let filtered = list.filter(movie => movie.addToWatchLater !== ''); 
    setFilteredMovieList(filtered);
  };

  useEffect(() => {
    refreshLists();
    
    const handleListChange = () => refreshLists();
    window.addEventListener('movieListChanged', handleListChange);
    
    return () => {
      window.removeEventListener('movieListChanged', handleListChange);
    };
  }, []);

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
        {t('watchLater.watchLater')}
      </Typography>
      <ShowSavedList filteredList={filteredMovieList} refreshList={refreshLists} />
    </Box>
  )
}

export default WatchLater