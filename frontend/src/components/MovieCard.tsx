import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Stack } from '@mui/material';
import placeholder from "../assets/placeholder1.jpg";
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegHeart, FaHeart } from "react-icons/fa6";
import { MdOutlineWatchLater, MdWatchLater } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useAuth } from "react-oidc-context";
import { Link } from 'react-router-dom';
import { MovieDetailsItem, SearchApiItem } from '../types/movieTypes.ts';
import { useAppDispatch } from '../app/hooks.ts';
import { addToWatchLater, removeFromWatchedList, removeFromWatchLater, updateRating } from '../features/movie/movieSlice.ts';
import ReactionButton from './ReactionButton.tsx';
import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider.tsx';

interface MovieCardProps {
  movie: Partial<MovieDetailsItem> & SearchApiItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const [ratingState, setRatingState] = useState<string>(movie.ratingState);
  const [isAddedToWatchLater, setIsAddedToWatchLater] = useState<boolean>(movie.addToWatchLater ? true : false);

    const { currentTheme, darkMode } = useCustomTheme();
    const getCurrentPalette = () => {
      const palette = themePalettes[currentTheme];
      return darkMode ? palette.dark : palette.light;
    };
  
    const currentPalette = getCurrentPalette();
    
  useEffect(() => {
    setRatingState(movie.ratingState);
    setIsAddedToWatchLater(movie.addToWatchLater ? true : false);
  }, [movie.ratingState, movie.addToWatchLater]);

  const handleRating = (rating: string) => {
    const currRatingState = ratingState;
    const currAddedToWatchLater = isAddedToWatchLater;
    const newRating = rating === currRatingState ? 'none' : rating;

    setRatingState(newRating);
    if(newRating !== 'none'){
      setIsAddedToWatchLater(false);
    }

    if (newRating === 'none') {
      dispatch(removeFromWatchedList(movie.imdbID)).unwrap().catch(() => {
        setRatingState(currRatingState);
        setIsAddedToWatchLater(currAddedToWatchLater);
      });
    }
    else {
      dispatch(updateRating({ imdbID: movie.imdbID, ratingState: newRating, Type: movie.Type })).unwrap().catch(() => {
        setRatingState(currRatingState);
        setIsAddedToWatchLater(currAddedToWatchLater);
      });
    }

  };

  const handleAddToWatchLater = () => {
    const currAddedToWatchLater = isAddedToWatchLater;

    setIsAddedToWatchLater((prev) => !prev);

    if (currAddedToWatchLater) {
      dispatch(removeFromWatchLater(movie.imdbID)).unwrap().catch(() => {
        setIsAddedToWatchLater(currAddedToWatchLater);
      });
    } else {
      dispatch(addToWatchLater({ imdbID: movie.imdbID, ratingState: ratingState, Type: movie.Type })).unwrap().catch(() => {
        setIsAddedToWatchLater(currAddedToWatchLater);
      });
    }

  };

  let ratingIcon;
  if (ratingState === 'none') {
    ratingIcon = <FaRegThumbsUp size={14} color={currentPalette.primary} />;
  } else if (ratingState === 'like') {
    ratingIcon = <FaThumbsUp size={14} />;
  } else if (ratingState === 'dislike') {
    ratingIcon = <FaThumbsDown size={14} />;
  } else if (ratingState === 'love') {
    ratingIcon = <FaHeart size={14} />;
  }

  return (
    <Card
  className="movie-card"
  sx={{
    position: 'relative',
    minWidth: '250px',
    width: '100%',
    height: 'clamp(300px, 18vw, 350px)',
    overflow: 'visible',
    transition: 'all 0.3s ease',
    boxShadow: darkMode
      ? `
        0.75rem 0 0.9375rem -0.5rem rgba(255, 255, 255, 0.2), 
        -0.25rem 0 0.375rem -0.25rem rgba(255, 255, 255, 0.1),
        0 0.5rem 0.625rem -0.3125rem rgba(255, 255, 255, 0.15)
      `
      : `
        0.75rem 0 0.9375rem -0.5rem rgba(0, 0, 0, 0.3), 
        -0.25rem 0 0.375rem -0.25rem rgba(0, 0, 0, 0.15),
        0 0.5rem 0.625rem -0.3125rem rgba(0, 0, 0, 0.2)
      `,
    borderRadius: '0.5rem',
    '&:hover': {
      transform: 'translateY(-0.5rem)', 
      boxShadow: darkMode
        ? `...` 
        : `...`,
    },
    '&:hover .card-overlay': {
      opacity: 1,
    },
  }}
>
      <Box
        className="movie-link"
        component={Link}
        to={`/movie/${movie.imdbID}`}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <CardMedia
          className="movie-poster"
          component="img"
          image={movie.Poster !== "N/A" ? movie.Poster : placeholder}
          alt={movie.Title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 2,
          }}
          onError={(e) => e.currentTarget.src = placeholder}
        />
      </Box>

      <Box
  className="card-overlay"
  sx={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '6.25rem', 
    bgcolor: currentPalette.background,
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.25rem',
    gap: '0.5625rem',
    borderBottomLeftRadius: '0.5rem', 
    borderBottomRightRadius: '0.5rem', 
    transition: 'opacity 0.3s ease',
  }}
>
{auth.isAuthenticated && (
  <>
        <Box
          className="rating-container"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            '&:hover .rating-options': {
              opacity: 1,
              visibility: 'visible',
              transform: 'translate(32px, 8px)',
            },
          }}
        >
          <IconButton
            className={`action-button ${ratingState !== 'none' ? 'active' : ''}`}
            sx={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              bgcolor: currentPalette.background,
    '& svg': {
                  color: currentPalette.primary,
                },
              border: ratingState !== 'none'
                ? `0.125rem solid ${currentPalette.secondary}`
                : `0.125rem solid ${currentPalette.primary}`,
              '&:hover': {
                borderColor: currentPalette.secondary,
                transform: 'scale(1.1)',
              },
              ...(ratingState !== 'none' && {
                bgcolor: currentPalette.primary,
                '& svg': {
                  color: currentPalette.background,
                },
                '&:hover': {
                  bgcolor: currentPalette.secondary,
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
          >
            {ratingIcon}
          </IconButton>

          <Stack
            className="rating-options"
            direction="row"
            spacing={1}
            sx={{
              position: 'absolute',
              left: -80,
              bottom: 0,
              opacity: 0,
              visibility: 'hidden',
              transition: 'all 0.2s ease',
              bgcolor: darkMode
                ? currentPalette.background
                : currentPalette.background,
              padding: '8px',
              borderRadius: '20px',
              zIndex: 20,
            }}
          >
            <ReactionButton
              title={t('card.dislikeTooltip')}
              state={ratingState === 'dislike'}
              onClick={() => handleRating('dislike')}
              activeIcon={<FaThumbsDown size={14} />}
              inactiveIcon={<FaRegThumbsDown size={14}  />}
            />

            <ReactionButton
              title={t('card.likeTooltip')}
              state={ratingState === 'like'}
              onClick={() => handleRating('like')}
              activeIcon={<FaThumbsUp size={14} />}
              inactiveIcon={<FaRegThumbsUp size={14} />}
            />

            <ReactionButton
              title={t('card.loveTooltip')}
              state={ratingState === 'love'}
              onClick={() => handleRating('love')}
              activeIcon={<FaHeart size={14} />}
              inactiveIcon={<FaRegHeart size={14} />}
            />


          </Stack>
        </Box>

        <ReactionButton
          title={isAddedToWatchLater ? t('card.removeWatchLaterTooltip') : t('card.addWatchLaterTooltip')}
          state={isAddedToWatchLater}
          onClick={handleAddToWatchLater}
          activeIcon={<MdWatchLater size={18} />}
          inactiveIcon={<MdOutlineWatchLater size={18} />}
        />
        </>
        )}
        <Box
          className="movie-info"
          sx={{
            marginLeft: 'auto',
            color: currentPalette.textPrimary,
            textAlign: 'right'
          }}
        >
          <Typography
  sx={{
    margin: '0.1875rem 0',
    fontSize: '0.8125rem',
    fontWeight: 700,
  }}
>
  {movie.Type.toUpperCase()}
</Typography>
<Typography
  sx={{
    margin: '0.1875rem 0',
    fontSize: '0.8125rem', 
    fontWeight: 700,
  }}
>
  {movie.Year}
</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default MovieCard;