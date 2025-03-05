import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMoviesByImdbId } from '../api/api';
import { useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';
import {
  Box,
  Typography,
  Container,
  Chip,
  Paper,
  Button,
  CircularProgress,
  Stack,
  useTheme
} from '@mui/material';

interface MovieData {
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Runtime: string;
  Released: string;
  Language: string;
  imdbID: string;
  Ratings: Array<{ Source: string; Value: string }>;
}

interface MovieResponse {
  movie: MovieData | null;
  error: string | null;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movieResponse, setMovieResponse] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetchMoviesByImdbId(t, id)
        .then((response) => {
          if (response) {
            setMovieResponse(response);
          } else {
            setMovieResponse({
              movie: null,
              error: t('error.unknownError')
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching movie:', error);
          setMovieResponse({
            movie: null,
            error: t('error.fetchFailed')
          });
          setLoading(false);
        });
    }
  }, [id, t]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.flow
        }}
      >
        <CircularProgress sx={{ color: theme.palette.detailsBox.topicColor, mb: 2 }} />
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (!movieResponse || movieResponse.error || !movieResponse.movie) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          padding: '0 2rem',
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.flow
        }}
      >
        <Typography variant="h4" sx={{ color: '#ff4d4d', mb: 2 }}>
          {t('error.movieNotFound')}
        </Typography>
        <Typography>
          {movieResponse?.error || t('error.unknownError')}
        </Typography>
      </Box>
    );
  }

  const movie = movieResponse.movie;
  console.log("movie details imdbid: " + movie.imdbID);

  return (
    <>
      <Container
        id="main-container"
        sx={{
          position: 'relative',
          margin: '0',
          minHeight: 'auto',
          padding: '2rem',
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.flow,
          maxWidth: {md: 'fit-content'}
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: '4rem',
            mt: 2,
          }}
        >
          {/* Poster */}
          <Box
            sx={{
              position: 'relative',
              alignSelf: { xs: 'center', md: 'flex-start' },
              flex: { md: '0 0 300px' },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Box
              component="img"
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-poster.jpg'}
              alt={movie.Title}
              sx={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                display: 'block',
                mt: '2rem'
              }}
            />
          </Box>

          {/* Movie Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 0.5,
                color: theme.palette.text.flow
              }}
            >
              {movie.Title}
            </Typography>

            <Box
              sx={{
                mb: 1,
                fontSize: '0.9rem',
                color: theme.palette.text.support
              }}
            >
              <Typography component="span">{movie.Runtime}</Typography>
              <Typography component="span" sx={{ mx: 0.5 }}>•</Typography>
              <Typography component="span">{movie.Released}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                mb: 1.5,
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank")}
                sx={{
                  height: '30px',
                  minWidth: '40px',
                  px: 1,
                  borderRadius: '8px',
                  bgcolor: theme.palette.background.flow,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: theme.palette.background.flowHover,
                  }
                }}
              >
                IMDB<LaunchIcon sx={{fontSize: 14}}/>
              </Button>
              
              <Box
                sx={{
                  width: '1px',
                  height: '30px',
                  mx: 1,
                  bgcolor: theme.palette.background.flow,
                }}
              />

              {movie.Genre.split(', ').map((genre, index) => (
                <Chip
                  key={index}
                  label={genre}
                  size="small"
                  sx={{
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.8rem',
                    bgcolor: theme.palette.detailsBox.bgColor,
                    color: theme.palette.detailsBox.textPrimary,
                  }}
                />
              ))}
            </Box>

            {/* Plot Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.detailsBox.topicColor,
                  mb: 0.5,
                  fontSize: '1.2rem',
                  textAlign: 'start',
                }}
              >
                {t('movie.plot')}
              </Typography>
              <Typography
                sx={{
                  lineHeight: 1.6,
                  textAlign: 'justify',
                  color: theme.palette.detailsBox.textPrimary,
                }}
              >
                {movie.Plot}
              </Typography>
            </Box>

            {/* Details Section */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: '0.8rem 1rem',
                  borderRadius: '8px',
                  minWidth: '150px',
                  flex: 1,
                  bgcolor: theme.palette.detailsBox.bgColor,
                  boxShadow: theme.palette.detailsBox.boxShadow,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.detailsBox.topicColor,
                    mb: 0.5,
                    fontSize: '1rem',
                  }}
                >
                  {t('movie.director')}
                </Typography>
                <Typography
                  sx={{
                    lineHeight: 1.5,
                    fontSize: '0.9rem',
                    color: theme.palette.detailsBox.textPrimary,
                  }}
                >
                  {movie.Director}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: '0.8rem 1rem',
                  borderRadius: '8px',
                  minWidth: '150px',
                  flex: 1, 
                  bgcolor: theme.palette.detailsBox.bgColor,
                  boxShadow: theme.palette.detailsBox.boxShadow
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.detailsBox.topicColor,
                    mb: 0.5,
                    fontSize: '1rem',
                  }}
                >
                  {t('movie.cast')}
                </Typography>
                <Typography
                  sx={{
                    lineHeight: 1.5,
                    fontSize: '0.9rem',
                    color: theme.palette.detailsBox.textPrimary,
                  }}
                >
                  {movie.Actors}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: '0.8rem 1rem',
                  borderRadius: '8px',
                  minWidth: '150px',
                  flex: 1,
                  bgcolor: theme.palette.detailsBox.bgColor,
                  boxShadow: theme.palette.detailsBox.boxShadow
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.detailsBox.topicColor,
                    mb: 0.5,
                    fontSize: '1rem',
                  }}
                >
                  {t('movie.language')}
                </Typography>
                <Typography
                  sx={{
                    lineHeight: 1.5,
                    fontSize: '0.9rem',
                    color: theme.palette.detailsBox.textPrimary,
                  }}
                >
                  {movie.Language}
                </Typography>
              </Paper>
            </Stack>

            {/* Ratings Section */}
            {movie.Ratings && movie.Ratings.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.detailsBox.topicColor,
                    fontSize: '18px',
                    lineHeight: 1.6,
                  }}
                >
                  {t('movie.ratings')}
                </Typography>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  sx={{ mt: 0.5 }}
                >
                  {movie.Ratings.map((rating, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: '0.8rem 1rem',
                        borderRadius: '8px',
                        minWidth: '260px',
                        bgcolor: theme.palette.detailsBox.bgColor,
                        boxShadow: theme.palette.detailsBox.boxShadow
                      }}
                    >
                      <Typography
                        sx={{
                          display: 'block',
                          fontSize: '0.9rem',
                          mb: 0.2,
                          color: theme.palette.detailsBox.textSecondary,
                        }}
                      >
                        {rating.Source}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          color: theme.palette.detailsBox.textSecondary,
                        }}
                      >
                        {rating.Value}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default MovieDetails;