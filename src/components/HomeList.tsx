import { useEffect, useState } from 'react';
import FavListFilter from './FavListFilter'
import { getMovieList, MovieItem } from '../utils/localStorage.ts';
import { useTranslation } from 'react-i18next';
import ShowFavList from './ShowFavList.tsx';
import { Box, Typography } from '@mui/material';

const HomeList = () => {
  const {t} = useTranslation();
  const [filteredMovieList, setFilteredMovieList] = useState<MovieItem[]>([]);
  const [activeType, setActiveType] = useState<string>("All");
  const [activeRating, setActiveRating] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key state

  // Function to refresh movie lists
  const refreshLists = () => {
    const list = getMovieList();
    
    // Re-apply current filters
    let filtered = list;
    
    if (activeType !== "All") {
      filtered = filtered.filter(movie => movie.Type === activeType);
    }
    
    if (activeRating) {
      filtered = filtered.filter(movie => movie.ratingState === activeRating);
    }
    
    setFilteredMovieList(filtered);
  };

  // Initial load
  useEffect(() => {
    refreshLists();
  }, [refreshKey]); // Add refreshKey as dependency

  // Listen for list changes
  useEffect(() => {
    const handleListChange = () => {
      setRefreshKey(prevKey => prevKey + 1); // Increment refresh key to trigger reload
    };

    window.addEventListener('movieListChanged', handleListChange);
    return () => {
      window.removeEventListener('movieListChanged', handleListChange);
    };
  }, [activeType, activeRating]); // Include these dependencies

  // When filters change, reapply them
  useEffect(() => {
    refreshLists();
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
        {t('fav.myList')}
      </Typography>
      <FavListFilter onFilterChange={handleFilterChange} />
      <ShowFavList filteredList={filteredMovieList} refreshList={refreshLists} />
    </Box>
  )
}

export default HomeList
