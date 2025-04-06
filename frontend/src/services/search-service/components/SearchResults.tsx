import React from 'react'
import MovieCard from '@/services/movie-service/components/MovieCard';
import { Box, Skeleton, Pagination, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import { enrichedSearchResults, fetchSearchResults, resetSearchBox, setError, setPage, setSearchState } from '@/redux/search/searchSlice';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider';

const SearchResults: React.FC = () => {

  const { t } = useTranslation();

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();

  const dispatch = useAppDispatch();
  const { loading, page, totalPages, searchParams } = useAppSelector((state) => state.search);
  const enrichedResults = useAppSelector(enrichedSearchResults);

  const handleNavLinkClick = () => {
    dispatch(setSearchState(false));
    dispatch(setError(null));
    dispatch(resetSearchBox());
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(fetchSearchResults({ query: searchParams.query, year: searchParams.year, type: searchParams.type, page: newPage }));
  }

  return (
    <Box sx={{ 
      margin: 0, 
      pb: '2.625rem', 
      width: '90%', 
      justifySelf: 'center', 
      alignItems: 'center', 
      // '@media (min-width: 2000px)': {
      //   width: '60%',
      //   pt: '3rem',
      // },
      }}> 
      {loading ? (
        <Box sx={{
          padding: '1.25rem 3vw',
          marginTop: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 250px)',
          gap: '1.2rem',
          rowGap: '3rem',
          justifyItems: 'center', 
          justifyContent: 'center',
        }}>
          {[...Array(10)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              animation="wave"
              sx={{
                bgcolor: currentPalette.paper,
                borderRadius: '0.5rem',
                minWidth: '250px',
                width: '100%', 
                height: 'clamp(300px, 18vw, 350px)'
              }}
            />
          ))}
        </Box>
      ) : enrichedResults.length > 0 ? (
        <Box sx={{
          padding: '1.25rem 3vw',
          marginTop: '1rem'
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 250px)',
            gap: '1.2rem', 
            rowGap: '3rem',
            justifyItems: 'center',    
            justifyContent: 'center',
          }}>
            {enrichedResults.map((movie) => (
              <Box key={movie.imdbID} sx={{ width: '100%' }}>
                <MovieCard movie={movie} />
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{
          textAlign: 'center',
          position: 'relative',
          top: '30vh'
        }}>
          <Typography sx={{
            position: 'relative',
            top: 0,
            textAlign: 'center',
            color: currentPalette.textPrimary,
            fontSize: 'clamp(1rem, 2vw, 1.25rem)'
          }}>
            {t('search.tryAgain')}{" "}

            <Link
              to="/home"
              onClick={handleNavLinkClick}
              style={{
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'rgb(5, 205, 5)'
              }}
            >
              {t('search.goHome')}
            </Link>
          </Typography>
        </Box>
      )}

      {totalPages > 1 && enrichedResults.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: '1.5rem', 
          mb: '1.5rem', 
          }}>  
          <Pagination
            variant="outlined"
            shape="rounded"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                color: currentPalette.primary,
                fontSize: {
                  xs: '0.875rem',  
                  sm: '1rem'     
                }
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: currentPalette.primary,
                color: '#fff',
                '&:hover': {
                  backgroundColor: currentPalette.primary,
                  color: '#fff',
                }
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: currentPalette.secondary,
                color: '#fff',
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchResults;