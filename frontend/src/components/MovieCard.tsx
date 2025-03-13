import { useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Stack, useTheme } from '@mui/material';
import placeholder from "../assets/placeholder1.jpg";
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegHeart, FaHeart } from "react-icons/fa6";
import { MdOutlineWatchLater, MdWatchLater } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MovieDetailsItem, SearchApiItem } from '../types/movieTypes.ts';
import { useAppDispatch } from '../app/hooks.ts';
import { addToWatchLater, removeFromWatchedList, removeFromWatchLater, updateRating } from '../features/movie/movieSlice.ts';
import ReactionButton from './ReactionButton.tsx';

interface MovieCardProps {
  movie: Partial<MovieDetailsItem> & SearchApiItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [ratingState, setRatingState] = useState<string>(movie.ratingState);
  const [isAddedToWatchLater, setIsAddedToWatchLater] = useState<boolean>(movie.addToWatchLater ? true : false);

  const handleRating = (rating: string) => {
    const currRatingState = ratingState;
    const currAddedToWatchLater = isAddedToWatchLater;
    const newRating = rating === currRatingState ? 'none' : rating;

    setRatingState(newRating);
    setIsAddedToWatchLater(false);

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
    ratingIcon = <FaRegThumbsUp size={14} color={theme.palette.customPrimary.icon} />;
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
        width: 250,
        height: 300,
        overflow: 'visible',
        transition: 'all 0.3s ease',
        boxShadow: theme.palette.mode === 'dark'
          ? `
            12px 0 15px -8px rgba(255, 255, 255, 0.2), 
            -4px 0 6px -4px rgba(255, 255, 255, 0.1),
            0 8px 10px -5px rgba(255, 255, 255, 0.15)
          `
          : `
            12px 0 15px -8px rgba(0, 0, 0, 0.3), 
            -4px 0 6px -4px rgba(0, 0, 0, 0.15),
            0 8px 10px -5px rgba(0, 0, 0, 0.2)
          `,
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark'
            ? `
              15px 0 25px -10px rgba(255, 255, 255, 0.3), 
              -6px 0 10px -6px rgba(255, 255, 255, 0.15),
              0 12px 15px -7px rgba(255, 255, 255, 0.2)
            `
            : `
              15px 0 25px -10px rgba(0, 0, 0, 0.4), 
              -6px 0 10px -6px rgba(0, 0, 0, 0.2),
              0 12px 15px -7px rgba(0, 0, 0, 0.25)
            `,
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
        />
      </Box>

      <Box
        className="card-overlay"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          bgcolor: theme.palette.background.cardOverlay,
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '9px',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          transition: 'opacity 0.3s ease',
        }}
      >
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
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: theme.palette.customPrimary.bg,
              border: ratingState !== 'none'
                ? `2px solid ${theme.palette.customPrimary.activeBorder}`
                : `2px solid ${theme.palette.customPrimary.border}`,
              '&:hover': {
                borderColor: theme.palette.customPrimary.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(ratingState !== 'none' && {
                bgcolor: theme.palette.customPrimary.activeBg,
                '& svg': {
                  color: theme.palette.customPrimary.activeIcon,
                },
                '&:hover': {
                  bgcolor: theme.palette.customPrimary.activeBg,
                  borderColor: theme.palette.customPrimary.hoverBorder,
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
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(230, 230, 230, 0.9)'
                : 'rgba(42, 42, 42, 0.9)',
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
              inactiveIcon={<FaRegThumbsDown size={14} color={theme.palette.customPrimary.icon} />}
              themeVariant="customPrimary"
            />

            <ReactionButton
              title={t('card.likeTooltip')}
              state={ratingState === 'like'}
              onClick={() => handleRating('like')}
              activeIcon={<FaThumbsUp size={14} />}
              inactiveIcon={<FaRegThumbsUp size={14} color={theme.palette.customPrimary.icon} />}
              themeVariant="customPrimary"
            />

            <ReactionButton
              title={t('card.loveTooltip')}
              state={ratingState === 'love'}
              onClick={() => handleRating('love')}
              activeIcon={<FaHeart size={14} />}
              inactiveIcon={<FaRegHeart size={14} color={theme.palette.customPrimary.icon} />}
              themeVariant="customPrimary"
            />


          </Stack>
        </Box>

        <ReactionButton
          title={isAddedToWatchLater ? t('card.removeWatchLaterTooltip') : t('card.addWatchLaterTooltip')}
          state={isAddedToWatchLater}
          onClick={handleAddToWatchLater}
          activeIcon={<MdWatchLater size={18} />}
          inactiveIcon={<MdOutlineWatchLater size={18} color={theme.palette.customPrimary.icon} />}
          themeVariant="customPrimary"
        />
        <Box
          className="movie-info"
          sx={{
            marginLeft: 'auto',
            color: theme.palette.text.secondary,
            textAlign: 'right'
          }}
        >
          <Typography
            sx={{
              margin: '3px 0',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {movie.Type.toUpperCase()}
          </Typography>
          <Typography
            sx={{
              margin: '3px 0',
              fontSize: 13,
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