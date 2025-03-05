import { useEffect, useState } from 'react';
import FavListFilter from './FavListFilter.tsx'
import { getMovieList, MovieItem } from '../api/api.ts';
import { useTranslation } from 'react-i18next';
import ShowSavedList from './ShowSavedList.tsx'
import { Box, Typography, useTheme } from '@mui/material';



const Favourites = () => {
  const {t} = useTranslation();
  const [filteredMovieList, setFilteredMovieList] = useState<MovieItem[]>([]);
  const [activeType, setActiveType] = useState<string>("All");
  const [activeRating, setActiveRating] = useState<string>("");
  const theme = useTheme();


  const refreshLists = async () => {
    const list: MovieItem[] = await getMovieList();
    console.log("list from getMovieList ", list)
    let filtered = list.filter(movie => movie.addToWatchedList !== '');
    
    if (activeType !== "All") {
      filtered = filtered.filter(movie => movie.Type === activeType);
    }
    
    if (activeRating) {
      filtered = filtered.filter(movie => movie.ratingState === activeRating);
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.addToWatchedList);
      const dateB = new Date(b.addToWatchedList);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });
    console.log("filtered in favourites, ", filtered)
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
          marginTop: '20px',
          color: theme.palette.text.flow
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