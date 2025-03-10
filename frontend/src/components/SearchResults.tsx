import React from 'react'
import MovieCard from './MovieCard';
import { Box, Skeleton, Pagination, Typography, useTheme } from "@mui/material";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { enrichedSearchResults, fetchSearchResults, resetSearchBox, setError, setPage, setSearchState } from '../features/search/searchSlice';

const SearchResults: React.FC = () => {

  const { t } = useTranslation();
  const theme = useTheme();
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
    dispatch(fetchSearchResults({query: searchParams.query, year: searchParams.year, type: searchParams.type, page: newPage}));
  }

  return (
    <Box sx={{ margin: 0, mb: '54px' }}>
      {loading ? (
        <Box sx={{
          padding: '20px 48px',
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '15px',
          rowGap: '48px'
        }}>
          {[...Array(10)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={300}
              sx={{
                bgcolor: 'grey.700',
                borderRadius: '8px'
              }}
            />
          ))}
        </Box>
      ) : enrichedResults.length > 0 ? (
        <Box sx={{
          padding: '20px 48px',
          marginTop: '16px'
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            rowGap: '48px',

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
          top: '300px'
        }}>
          <Typography sx={{ position: 'relative', top: 0, textAlign: 'center', color: theme.palette.text.flow }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <Pagination
            variant="outlined"
            shape="rounded"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                color: theme.palette.pagination.color,
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: theme.palette.pagination.activebg,
                color: theme.palette.pagination.activeColor,
                '&:hover': {
                  backgroundColor: theme.palette.pagination.activebg,
                  color: theme.palette.pagination.activeColor,
                }
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: '#444',
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