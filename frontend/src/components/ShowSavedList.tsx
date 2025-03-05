import { useEffect, useState } from 'react';
import { MovieItem } from '../api/api.ts';
import MovieCard from './MovieCard';
import { fetchMoviesByImdbId } from '../api/api';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Typography, useTheme } from "@mui/material";

interface SimplifiedMovie {
  Type: "none" | "movie" | "series" | "game";
  imdbID: string;
  Poster: string;
  Year: string;
  Title: string;
  ratingState: "none" | "dislike" | "like" | "love";
}

interface ShowSavedListProps {
  filteredList: MovieItem[];
  refreshList: () => void;
}

const ShowSavedList: React.FC<ShowSavedListProps> = ({ filteredList, refreshList }) => {
  const { t } = useTranslation();
  const [filteredMovies, setFilteredMovies] = useState<SimplifiedMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();


  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      if (filteredList.length === 0) {
        setLoading(false);
        return; // No items to fetch, exit early
      }

      try {
        const fetchPromises = filteredList.map(async (movie) => {
          try {
            const result = await fetchMoviesByImdbId(t, movie.imdbID);
            if (result && result.movie.Response === "True") {
              return {
                Type: result.movie.Type as "none" | "movie" | "series" | "game",
                imdbID: result.movie.imdbID || movie.imdbID,
                Poster: result.movie.Poster || 'N/A',
                Year: result.movie.Year || 'N/A',
                Title: result.movie.Title || 'Unknown Title',
                ratingState: movie.ratingState as "none" | "dislike" | "like" | "love",
              };
            }
          } catch (err) {
            console.error(`Failed to fetch movie ${movie.imdbID}:`, err);
          }
          return null; // Return null if fetching fails
        });

        const results = await Promise.all(fetchPromises);
        const simplifiedResults = results.filter((movie): movie is SimplifiedMovie => movie !== null);

        setFilteredMovies(simplifiedResults);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(t('error.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [filteredList, t]);

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
            {filteredMovies.map((movie) => (
              <Box key={movie.imdbID}>
                <MovieCard movie={movie} onListChange={refreshList} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ShowSavedList;
