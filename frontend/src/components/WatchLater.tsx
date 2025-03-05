import { useEffect, useState } from 'react';
import { getMovieList, MovieItem } from '../api/api.ts';
import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx';
import { Box, Typography, useTheme } from '@mui/material';

const WatchLater = () => {
  const {t} = useTranslation();
  const [filteredMovieList, setFilteredMovieList] = useState<MovieItem[]>([]);
  const theme = useTheme();
  
  const refreshLists = async () => {
    const list: MovieItem[] = await getMovieList();
    let filtered = list.filter(movie => movie.addToWatchLater !== ''); 
    filtered.sort((a, b) => {
      const dateA = new Date(a.addToWatchLater);
      const dateB = new Date(b.addToWatchLater);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });
    console.log("filtered in watch later: ", filtered)
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
          marginTop: '20px',
          color: theme.palette.text.flow
        }}
      >
        {t('watchLater.watchLater')}
      </Typography>
      <ShowSavedList filteredList={filteredMovieList} refreshList={refreshLists} />
    </Box>
  )
}

export default WatchLater