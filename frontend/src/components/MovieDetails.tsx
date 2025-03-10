import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';
import BackButton from './BackButton';
import {
  Box,
  Typography,
  Container,
  Chip,
  Paper,
  Button,
  CircularProgress,
  Stack,
  useTheme,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMovieByImdbId } from '../features/search/searchSlice';
import { MovieDetailsItem } from '../types/movieTypes';
import { FaRegThumbsUp, FaThumbsUp, FaThumbsDown, FaHeart, FaRegHeart, FaRegThumbsDown } from 'react-icons/fa6';
import { removeFromWatchedList, updateRating, removeFromWatchLater, addToWatchLater } from '../features/movie/movieSlice';
import { MdOutlineWatchLater, MdWatchLater } from 'react-icons/md';

const MovieDetails: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [movieResponse, setMovieResponse] = useState<MovieDetailsItem | null>(null);

  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.search);

  const [ratingState, setRatingState] = useState<string>('none');
  const [isAddedtoWatchLater, setIsAddedToWatchLater] = useState<boolean>(false);

  useEffect(() => {
    if (imdbID) {
      dispatch(fetchMovieByImdbId(imdbID))
        .unwrap()
        .then((result) => {
          setMovieResponse(result);
          // Update state after we get the movie response
          setRatingState(result.ratingState || 'none');
          setIsAddedToWatchLater(result.addToWatchLater ? true : false);
        });
    }
  }, [imdbID, dispatch]);

  const handleRating = (rating: string) => {
    if (!movieResponse) return;

    const newRating = rating === ratingState ? 'none' : rating;
    
    if (newRating === 'none') {
      dispatch(removeFromWatchedList(movieResponse.imdbID));
    } else {
      dispatch(updateRating({ imdbID: movieResponse.imdbID, ratingState: newRating, Type: movieResponse.Type }));
    }
    setRatingState(newRating);
    setIsAddedToWatchLater(false);
  };

  const handleAddToWatchLater = () => {
    if (!movieResponse) return;

    if (isAddedtoWatchLater) {
      dispatch(removeFromWatchLater(movieResponse.imdbID));
      setIsAddedToWatchLater(false);
    } else {
      dispatch(addToWatchLater({ imdbID: movieResponse.imdbID, ratingState: ratingState, Type: movieResponse.Type }));
      setIsAddedToWatchLater(true);
    }
  };

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

  if (error) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: 'center',
          color: 'red',
          position: 'relative',
          top: '250px',
          fontSize: '20px'
        }}
      >
        {t(`error.${error}`)}
      </Typography>
    );
  }

  if (movieResponse) {

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
            maxWidth: { md: 'fit-content' }
          }}
        >
          <BackButton />
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
                src={movieResponse.Poster !== 'N/A' ? movieResponse.Poster : '/placeholder-poster.jpg'}
                alt={movieResponse.Title}
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
                {movieResponse.Title}
              </Typography>
              <Box sx={{
                display: 'flex',
                gap: '3px'
              }}>
                <Box
                  sx={{
                    mb: 1,
                    fontSize: '0.9rem',
                    color: theme.palette.text.support
                  }}
                >
                  <Typography component="span">{movieResponse.Runtime}</Typography>
                  <Typography component="span" sx={{ mx: 0.5 }}>•</Typography>
                  <Typography component="span">{movieResponse.Released}</Typography>

                </Box>
                <Box
                  sx={{
                    width: '1px',
                    height: '20px',
                    mx: 1,
                    mt: '2px',
                    bgcolor: theme.palette.background.flow,
                  }}
                />

                {movieResponse.Genre.split(', ').map((genre, index) => (
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

              {/* Action Buttons */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mt: 0.5,
                  mb: 3,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 2 }
                }}
              >
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => window.open(`https://www.imdb.com/title/${movieResponse.imdbID}`, "_blank")}
                  sx={{
                    height: '40px',
                    borderRadius: '8px',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.9)' : '#f5c518',
                    color: '#000000',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 1)' : '#e8ba17',
                    },
                    boxShadow: theme.shadows[2]

                  }}
                  startIcon={<LaunchIcon />}
                >
                  IMDb
                </Button>

                {/* Rating Container */}
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    backdropFilter: 'blur(4px)',
                    boxShadow: theme.shadows[2]
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* Dislike Button */}
                    <Tooltip
                      title={t('card.dislikeTooltip')}
                      placement="top"
                      arrow
                    >
                      <IconButton
                className={`action-button ${ratingState === 'dislike' ? 'active' : ''}`}
                onClick={() => handleRating('dislike')}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: theme.palette.customSecondary.bg,
              border: ratingState === 'dislike' 
                ? `2px solid ${theme.palette.customSecondary.activeBorder}` 
                : `2px solid ${theme.palette.customSecondary.border}`,
              '&:hover': {
                borderColor: theme.palette.customSecondary.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(ratingState === 'dislike' && {
                bgcolor: theme.palette.customSecondary.activeBg,
                '& svg': {
                  color: theme.palette.customSecondary.activeIcon,
                },
                '&:hover': {
                  bgcolor: theme.palette.customSecondary.activeBg,
                  borderColor: theme.palette.customSecondary.hoverBorder,
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
              >
                {ratingState === 'dislike' ? 
                  <FaThumbsDown size={14} /> : 
                  <FaRegThumbsDown size={14} color={theme.palette.customSecondary.icon} />
                }
              </IconButton>
                    </Tooltip>

                    {/* Like Button */}
                    <Tooltip
                      title={t('card.likeTooltip')}
                      placement="top"
                      arrow
                    >
                      <IconButton
                className={`action-button ${ratingState === 'like' ? 'active' : ''}`}
                onClick={() => handleRating('like')}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: theme.palette.customSecondary.bg,
              border: ratingState === 'like' 
                ? `2px solid ${theme.palette.customSecondary.activeBorder}` 
                : `2px solid ${theme.palette.customSecondary.border}`,
              '&:hover': {
                borderColor: theme.palette.customSecondary.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(ratingState === 'like' && {
                bgcolor: theme.palette.customSecondary.activeBg,
                '& svg': {
                  color: theme.palette.customSecondary.activeIcon,
                },
                '&:hover': {
                  bgcolor: theme.palette.customSecondary.activeBg,
                  borderColor: theme.palette.customSecondary.hoverBorder,
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
              >
                {ratingState === 'like' ? 
                  <FaThumbsUp size={14} /> : 
                  <FaRegThumbsUp size={14} color={theme.palette.customSecondary.icon} />
                }
              </IconButton>
                    </Tooltip>

                    {/* Love Button */}
                    <Tooltip
                      title={t('card.loveTooltip')}
                      placement="top"
                      arrow
                    >
                      <IconButton
                className={`action-button ${ratingState === 'love' ? 'active' : ''}`}
                onClick={() => handleRating('love')}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: theme.palette.customSecondary.bg,
              border: ratingState === 'love' 
                ? `2px solid ${theme.palette.customSecondary.activeBorder}` 
                : `2px solid ${theme.palette.customSecondary.border}`,
              '&:hover': {
                borderColor: theme.palette.customSecondary.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(ratingState === 'love' && {
                bgcolor: theme.palette.customSecondary.activeBg,
                '& svg': {
                  color: theme.palette.customSecondary.activeIcon,
                },
                '&:hover': {
                  bgcolor: theme.palette.customSecondary.activeBg,
                  borderColor: theme.palette.customSecondary.hoverBorder,
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
              >
                {ratingState === 'love' ? 
                  <FaHeart size={14} /> : 
                  <FaRegHeart size={14} color={theme.palette.customSecondary.icon} />
                }
              </IconButton>
                    </Tooltip>

                    <Box
                      sx={{
                        width: '1px',
                        height: '25px',
                        mx: 1,
                        mt: '2px',
                        bgcolor: theme.palette.background.flow,
                      }}
                    />

                    {/* Watch Later Button */}
                    <Tooltip
                      title={isAddedtoWatchLater ? t('card.removeWatchLaterTooltip') : t('card.addWatchLaterTooltip')}
                      placement="top"
                      arrow
                    >
                      <IconButton
            className={`action-button ${isAddedtoWatchLater ? 'active' : ''}`}
            onClick={handleAddToWatchLater}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: theme.palette.customSecondary.bg,
              border: isAddedtoWatchLater
                ? `2px solid ${theme.palette.customSecondary.activeBorder}` 
                : `2px solid ${theme.palette.customSecondary.border}`,
              '&:hover': {
                borderColor: theme.palette.customSecondary.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(isAddedtoWatchLater && {
                bgcolor: theme.palette.customSecondary.activeBg,
                '& svg': {
                  color: theme.palette.customSecondary.activeIcon,
                },
                '&:hover': {
                  bgcolor: theme.palette.customSecondary.activeBg,
                  borderColor: theme.palette.customSecondary.hoverBorder,
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
          >
            {isAddedtoWatchLater ? 
              <MdWatchLater size={18} /> : 
              <MdOutlineWatchLater size={18} color={theme.palette.customSecondary.icon} />
            }
          </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              </Stack>

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
                  {movieResponse.Plot}
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
                    {movieResponse.Director}
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
                    {movieResponse.Actors}
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
                    {movieResponse.Language}
                  </Typography>
                </Paper>
              </Stack>

              {/* Ratings Section */}
              {movieResponse.Ratings && movieResponse.Ratings.length > 0 && (
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
                    {movieResponse.Ratings.map((rating, index) => (
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
  }

};

export default MovieDetails;