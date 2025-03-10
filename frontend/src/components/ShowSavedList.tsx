
import MovieCard from './MovieCard';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { MovieDetailsItem } from '../types/movieTypes.ts';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { useEffect } from 'react';
import { filtersApplied } from '../features/filter/filterSlice.ts';

interface ShowSavedListProps {
  filteredList: MovieDetailsItem[];
}

const ShowSavedList: React.FC<ShowSavedListProps> = ({ filteredList }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.filter.loading);
  const error = useAppSelector((state) => state.filter.error);

  useEffect(() => {
    if (loading) { 
      const timer = setTimeout(() => {
        dispatch(filtersApplied());
      }, 500);
  
      return () => clearTimeout(timer);
    }
  }, [loading, dispatch]);

  if (error) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: 'center',
          color: theme.palette.text.flow
        }}
      >
        {error}
      </Typography>
    );
  }

  if (filteredList.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: 'center',
          position: 'relative',
          top: '200px',
          color: theme.palette.text.flow
        }}
      >
        {t('fav.empty')}
      </Typography>
    );
  }

  return (
    <Box sx={{ margin: 0, mb: '42px' }}>
      {loading ? (
        <Box sx={{
          padding: '20px 48px',
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '15px',
          rowGap: '48px',

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
      ) : (
        <Box sx={{
          padding: '20px 48px',
          marginTop: '16px',
        }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            rowGap: '48px',

          }}>
            {filteredList.map((movie) => (
              <Box key={movie.imdbID}>
                <MovieCard movie={movie} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ShowSavedList;
