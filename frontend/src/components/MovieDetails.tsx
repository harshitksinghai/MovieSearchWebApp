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
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMovieByImdbId } from '../features/search/searchSlice';
import { MovieDetailsItem } from '../types/movieTypes';
import { FaRegThumbsUp, FaThumbsUp, FaThumbsDown, FaHeart, FaRegHeart, FaRegThumbsDown } from 'react-icons/fa6';
import { removeFromWatchedList, updateRating, removeFromWatchLater, addToWatchLater } from '../features/movie/movieSlice';
import { MdOutlineWatchLater, MdWatchLater } from 'react-icons/md';
import ReactionButton from './ReactionButton';
import placeholder from "../assets/placeholder1.jpg";
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider';
import { useAuth } from 'react-oidc-context';
import { toast } from 'sonner';
import i18n from '@/i18n/config';

const MovieDetails: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [movieResponse, setMovieResponse] = useState<MovieDetailsItem | null>(null);
  const auth = useAuth();
  const { t } = useTranslation();

  const { currentTheme, darkMode } = useCustomTheme();
  const getCurrentPalette = () => {
    const palette = themePalettes[currentTheme];
    return darkMode ? palette.dark : palette.light;
  };

  const currentPalette = getCurrentPalette();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.search);
  const myListState = useAppSelector((state) => state.movie.myListState);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


  const [ratingState, setRatingState] = useState<string>('none');
  const [isAddedToWatchLater, setIsAddedToWatchLater] = useState<boolean>(false);

  useEffect(() => {
    if (imdbID) {
      dispatch(fetchMovieByImdbId(imdbID))
        .unwrap()
        .then((result) => {
          setMovieResponse(result);
          setRatingState(result.ratingState || 'none');
          setIsAddedToWatchLater(result.addToWatchLater ? true : false);
        });
    }
  }, [imdbID, dispatch, myListState]);

  const handleRating = (rating: string) => {
    if (!movieResponse) return;
    if (!auth.isAuthenticated) {
      toast(t('card.signInToRate'), {
        action: {
          label: 'Sign In',
          onClick: () => auth.signinRedirect()
        },
      });
      return;
    }
    const currRatingState = ratingState;
    const currAddedToWatchLater = isAddedToWatchLater;
    const newRating = rating === currRatingState ? 'none' : rating;

    setRatingState(newRating);
    setIsAddedToWatchLater(false);

    if (newRating === 'none') {
      dispatch(removeFromWatchedList(movieResponse.imdbID)).unwrap().catch(() => {
        setRatingState(currRatingState);
        setIsAddedToWatchLater(currAddedToWatchLater);
        toast.error(t('error.ratingOptimisticFailed'));
      });
    }
    else {
      dispatch(updateRating({ imdbID: movieResponse.imdbID, ratingState: newRating, Type: movieResponse.Type })).unwrap().catch(() => {
        setRatingState(currRatingState);
        setIsAddedToWatchLater(currAddedToWatchLater);
        toast.error(t('error.ratingOptimisticFailed'));
      });
    }
  };

  const handleAddToWatchLater = () => {
    if (!movieResponse) return;
    if (!auth.isAuthenticated) {
      toast(t('card.signInToAddToWatchLater'), {
        action: {
          label: 'Sign In',
          onClick: () => auth.signinRedirect()
        },
      });
      return;
    }

    const currAddedToWatchLater = isAddedToWatchLater;

    setIsAddedToWatchLater((prev) => !prev);

    if (currAddedToWatchLater) {
      dispatch(removeFromWatchLater(movieResponse.imdbID)).unwrap().catch(() => {
        setIsAddedToWatchLater(currAddedToWatchLater);
        toast.error(t('error.watchLaterOptimisticFailed'));
      });
    } else {
      dispatch(addToWatchLater({ imdbID: movieResponse.imdbID, ratingState: ratingState, Type: movieResponse.Type })).unwrap().catch(() => {
        setIsAddedToWatchLater(currAddedToWatchLater); 
        toast.error(t('error.watchLaterOptimisticFailed'));
      });
    }
  };

  const formatBoxOffice = () => {
    if(!movieResponse?.BoxOffice) return;
    const numericValue = parseFloat(movieResponse.BoxOffice.replace(/[^0-9.-]+/g, ""));

    const storedLanguage = localStorage.getItem('i18nextLng') || i18n.language;
    console.log("language stored: ",storedLanguage)
   
    const languageCurrencyMap :any= {
      'en': { locale: 'en-US', currency: 'USD' },
      'es': { locale: 'es-ES', currency: 'EUR' },
      'fr': { locale: 'fr-FR', currency: 'EUR' }
    };
   
    const { locale, currency } = languageCurrencyMap[storedLanguage] ||
      languageCurrencyMap['en'];
   
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(numericValue);
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
          bgcolor: currentPalette.background,
          color: currentPalette.textPrimary
        }}
      >
        <CircularProgress sx={{ color: currentPalette.textPrimary, mb: 2 }} />
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
            position: isSmallScreen ? 'static' : 'absolute',
            top: isSmallScreen ? 'auto' : '50%',
            left: isSmallScreen ? 'auto' : '50%',
            transform: isSmallScreen ? 'none' : 'translate(-50%, -50%)',
            margin: '0',
            minHeight: '60%',
            maxHeight: '80%',
            overflowY: 'auto',
            padding: '2rem',
            bgcolor: currentPalette.background,
            color: currentPalette.textPrimary,
            minWidth: window.innerWidth > 2000 ? '80%' : '100%',
            maxWidth: { md: 'fit-content' }
          }}
        >
          <BackButton />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: '4rem',
              mt: 2,
              alignItems: isSmallScreen ? 'center' : 'flex-start',
            }}
          >
            {/* Poster */}
            <Box
              sx={{
                position: 'relative',
                alignSelf: 'center',
                flex: isSmallScreen ? 'none' : { md: '0 0 300px' },
                mb: { xs: 2, md: 0 },
                width: isSmallScreen ? '100%' : 'auto',
                maxWidth: '300px',
              }}
            >
              <Box
                component="img"
                src={movieResponse.Poster !== 'N/A' ? movieResponse.Poster : placeholder}
                alt={movieResponse.Title}
                sx={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  display: 'block',
                  mt: isSmallScreen ? '1rem' : '2rem'
                }}
              />
            </Box>

            {/* Movie Info */}
            <Box sx={{
              flex: 1,
              width: isSmallScreen ? '100%' : 'auto',
              textAlign: isSmallScreen ? 'center' : 'left'
            }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  mb: 0.5,
                  color: currentPalette.textPrimary,
                  textAlign: isSmallScreen ? 'center' : 'left'
                }}
              >
                {movieResponse.Title}
              </Typography>
              <Box sx={{
                display: 'flex',
                gap: '3px',
                justifyContent: isSmallScreen ? 'center' : 'flex-start',
                flexWrap: 'wrap'
              }}>
                <Box
                  sx={{
                    mb: 1,
                    fontSize: '0.9rem',
                    color: currentPalette.textPrimary,
                    textAlign: 'center'
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
                    bgcolor: currentPalette.primary,
                    display: isSmallScreen ? 'none' : 'block'
                  }}
                />

                <Box sx={{
                  display: 'flex',
                  justifyContent: isSmallScreen ? 'center' : 'flex-start',
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  {movieResponse.Genre.split(', ').map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      size="small"
                      sx={{
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        padding: '0.3rem 0.8rem',
                        bgcolor: currentPalette.paper,
                        color: currentPalette.textPrimary,
                      }}
                    />
                  ))}
                </Box>


              </Box>
              {movieResponse.BoxOffice && (
                <>
                  <Typography component="span">{t('movie.boxOffice')} {formatBoxOffice()}</Typography>
                </>
              )}
              {/* Action Buttons */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mt: 2,
                  mb: 3,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 2 },
                  justifyContent: isSmallScreen ? 'center' : 'flex-start'
                }}
              >
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => window.open(`https://www.imdb.com/title/${movieResponse.imdbID}`, "_blank")}
                  sx={{
                    height: '40px',
                    borderRadius: '8px',
                    bgcolor: darkMode ? 'rgba(255, 215, 0, 0.9)' : '#f5c518',
                    color: '#000000',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255, 215, 0, 1)' : '#e8ba17',
                    },
                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)'
                  }}
                  startIcon={<LaunchIcon />}
                >
                  IMDb
                </Button>
                {/* {auth.isAuthenticated && ( */}
                <>
                  {/* Rating Container */}
                  <Paper
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: currentPalette.background,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: `1px solid ${alpha(currentPalette.textPrimary, 0.1)}`,
                      backdropFilter: 'blur(4px)',
                      boxShadow: `0px 1px 5px ${darkMode ? 'rgba(252, 252, 252, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ReactionButton
                        title={t('card.dislikeTooltip')}
                        state={ratingState === 'dislike'}
                        onClick={() => handleRating('dislike')}
                        activeIcon={<FaThumbsDown size={14} />}
                        inactiveIcon={<FaRegThumbsDown size={14} color={currentPalette.primary} />}
                      />

                      <ReactionButton
                        title={t('card.likeTooltip')}
                        state={ratingState === 'like'}
                        onClick={() => handleRating('like')}
                        activeIcon={<FaThumbsUp size={14} />}
                        inactiveIcon={<FaRegThumbsUp size={14} color={currentPalette.primary} />}
                      />

                      <ReactionButton
                        title={t('card.loveTooltip')}
                        state={ratingState === 'love'}
                        onClick={() => handleRating('love')}
                        activeIcon={<FaHeart size={14} />}
                        inactiveIcon={<FaRegHeart size={14} color={currentPalette.primary} />}
                      />

                      <Box
                        sx={{
                          width: '1px',
                          height: '25px',
                          mx: 1,
                          mt: '2px',
                          bgcolor: currentPalette.primary,
                        }}
                      />

                      <ReactionButton
                        title={isAddedToWatchLater ? t('card.removeWatchLaterTooltip') : t('card.addWatchLaterTooltip')}
                        state={isAddedToWatchLater}
                        onClick={handleAddToWatchLater}
                        activeIcon={<MdWatchLater size={18} />}
                        inactiveIcon={<MdOutlineWatchLater size={18} color={currentPalette.primary} />}
                      />
                    </Stack>
                  </Paper>
                </>
                {/* )} */}
              </Stack>

              {/* Plot Section */}
              <Box sx={{
                mb: 2,
                boxShadow: `0px 1px 5px ${darkMode ? 'rgba(252, 252, 252, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
                padding: '4px 12px',
                borderRadius: '8px',
                border: `1px solid ${alpha(currentPalette.textPrimary, 0.1)}`,
                backdropFilter: 'blur(4px)',
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: currentPalette.textSecondary,
                    mb: 0.5,
                    fontSize: '1.2rem',
                    textAlign: isSmallScreen ? 'center' : 'start',
                  }}
                >
                  {t('movie.plot')}
                </Typography>
                <Typography
                  sx={{
                    lineHeight: 1.6,
                    textAlign: isSmallScreen ? 'center' : 'justify',
                    color: currentPalette.textPrimary,
                  }}
                >
                  {movieResponse.Plot}
                </Typography>
              </Box>

              {/* Details Section */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                  mb: 2,
                  alignItems: isSmallScreen ? 'center' : 'stretch'
                }}
              >
                {[
                  { title: t('movie.director'), content: movieResponse.Director },
                  { title: t('movie.cast'), content: movieResponse.Actors },
                  { title: t('movie.language'), content: movieResponse.Language }
                ].map((section, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: '0.8rem 1rem',
                      minWidth: '150px',
                      flex: 1,
                      width: isSmallScreen ? '100%' : 'auto',
                      bgcolor: currentPalette.background,
                      boxShadow: `0px 1px 5px ${darkMode ? 'rgba(252, 252, 252, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${alpha(currentPalette.textPrimary, 0.1)}`,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: currentPalette.textSecondary,
                        mb: 0.5,
                        fontSize: '1rem',
                        textAlign: isSmallScreen ? 'center' : 'left',
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      sx={{
                        lineHeight: 1.5,
                        fontSize: '0.9rem',
                        color: currentPalette.textPrimary,
                        textAlign: isSmallScreen ? 'center' : 'left',
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              {/* Ratings Section */}
              {movieResponse.Ratings && movieResponse.Ratings.length > 0 && (
                <Box sx={{ mt: 2, pb: '1rem' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: currentPalette.textSecondary,
                      fontSize: '18px',
                      lineHeight: 1.6,
                      textAlign: isSmallScreen ? 'center' : 'left',
                    }}
                  >
                    {t('movie.ratings')}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    flexWrap="wrap"
                    spacing={2}
                    sx={{
                      mt: 0.5,
                      justifyContent: isSmallScreen ? 'center' : 'flex-start'
                    }}
                  >
                    {movieResponse.Ratings.map((rating, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: '0.8rem 1rem',
                          minWidth: '254px',
                          bgcolor: currentPalette.background,
                          boxShadow: `0px 1px 5px ${darkMode ? 'rgba(252, 252, 252, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
                          padding: '4px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${alpha(currentPalette.textPrimary, 0.1)}`,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'block',
                            fontSize: '0.9rem',
                            mb: 0.2,
                            color: currentPalette.textPrimary,
                            textAlign: isSmallScreen ? 'center' : 'left',
                          }}
                        >
                          {rating.Source}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            color: currentPalette.textPrimary,
                            textAlign: isSmallScreen ? 'center' : 'left',
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