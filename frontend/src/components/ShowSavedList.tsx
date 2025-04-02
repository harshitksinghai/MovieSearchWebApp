import MovieCard from './MovieCard';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Typography } from "@mui/material";
import { MovieDetailsItem } from '../types/movieTypes.ts';
import { useAppSelector } from '../app/hooks.ts';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider.tsx';

interface ShowSavedListProps {
  filteredList: MovieDetailsItem[];
  loading: boolean;
}

const ShowSavedList: React.FC<ShowSavedListProps> = ({ filteredList, loading }) => {
  const { t } = useTranslation();

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };
  
  const currentPalette = getCurrentPalette();

  const error = useAppSelector((state) => state.filter.error);

  if (error) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: 'center',
          color: currentPalette.textPrimary
        }}
      >
        {error}
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box sx={{ margin: 0, mb: '2.625rem', width: '90%', justifySelf: 'center', alignItems: 'center' }}>  
        <Box sx={{
          padding: '1.25rem 3vw',
          marginTop: '1rem',
        }}>
          <Box sx={{
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
              width="100%"
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
        </Box>
      </Box>
    );
  }

  if (!loading && filteredList.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: 'center',
          position: 'relative',
          top: '20vh',
          color: currentPalette.textPrimary,
          fontSize: 'clamp(1rem, 2vw, 1.25rem)'
        }}
      >
        {t('fav.empty')}
      </Typography>
    );
  }

  return (
    <Box sx={{ margin: 0, mb: '2.625rem', width: '90%', justifySelf: 'center', alignItems: 'center' }}>  
      <Box sx={{
        padding: '1.25rem 3vw',
        marginTop: '1rem',
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 250px)',
          gap: '1.2rem',
          rowGap: '3rem',
          justifyItems: 'center', 
          justifyContent: 'center',
        }}>
          {filteredList.map((movie) => (
            <Box key={movie.imdbID} sx={{ width: '100%' }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ShowSavedList;