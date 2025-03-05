import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Tooltip, Stack, useTheme } from '@mui/material';
import placeholder from "../assets/placeholder1.jpg";
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegHeart, FaHeart } from "react-icons/fa6";
import { MdOutlineWatchLater, MdWatchLater } from "react-icons/md";
import { updateRating, getMovieList, removeFromWatchedList, removeFromWatchLater, addToWatchLater, MovieItem } from '../api/api.ts';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: any;
  onListChange?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onListChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [ratingState, setRatingState] = useState<'none' | 'dislike' | 'like' | 'love'>('none');
  const [isAddedtoWatchLater, setIsAddedToWatchLater] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      const movieList: MovieItem[] = await getMovieList();
      const storedMovie = movieList.find((m) => m.imdbID === movie.imdbID);
  
      if(!storedMovie){
        setIsAddedToWatchLater(false);
        setRatingState('none');
        return;
      }
      if(storedMovie.addToWatchLater !== ''){
        setIsAddedToWatchLater(true);
      }
      setRatingState(storedMovie.ratingState);
    };
  
    fetchMovieData();
  }, [movie.imdbID]);

  const notifyChange = () => {
    window.dispatchEvent(new CustomEvent('movieListChanged'));
    
    if (onListChange) {
      onListChange();
    }
  };

  const handleRating = async (rating: 'dislike' | 'like' | 'love') => {
    const newRating = rating === ratingState ? 'none' : rating;
    setRatingState(newRating);
    setIsAddedToWatchLater(false);
    if(newRating === 'none'){
      await removeFromWatchedList(movie.imdbID);
    }
    else{
      await updateRating(movie.imdbID, newRating, movie.Type);
    }
    notifyChange();
  };

  const handleAddToWatchLater = async () => {
    if (isAddedtoWatchLater) {
      setIsAddedToWatchLater(!isAddedtoWatchLater);
      await removeFromWatchLater(movie.imdbID);
    } else {
      setIsAddedToWatchLater(!isAddedtoWatchLater);
      await addToWatchLater(movie.imdbID, ratingState, movie.Type);
    }
    notifyChange();
  };

  let ratingIcon;
  if (ratingState === 'none') {
    ratingIcon = <FaRegThumbsUp size={14} color={theme.palette.iconColor} />;
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
              bgcolor: theme.palette.ratingButton.background,
              border: ratingState !== 'none' 
                ? `2px solid ${theme.palette.ratingButton.activeBorder}` 
                : `2px solid ${theme.palette.ratingButton.border}`,
              '&:hover': {
                borderColor: theme.palette.ratingButton.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(ratingState !== 'none' && {
                bgcolor: theme.palette.ratingButton.activeBackground,
                '& svg': {
                  color: theme.palette.svgColor,
                },
                '&:hover': {
                  bgcolor: theme.palette.ratingButton.activeBackground,
                  borderColor: theme.palette.ratingButton.hoverBorder,
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
                  bgcolor: theme.palette.ratingButton.background,
                  border: ratingState === 'dislike' 
                    ? `2px solid ${theme.palette.ratingButton.activeBorder}` 
                    : `2px solid ${theme.palette.ratingButton.border}`,
                  '&:hover': {
                    borderColor: theme.palette.ratingButton.hoverBorder,
                    transform: 'scale(1.1)',
                  },
                  ...(ratingState === 'dislike' && {
                    bgcolor: theme.palette.ratingButton.activeBackground,
                    '& svg': {
                      color: theme.palette.svgColor,
                    },
                    '&:hover': {
                      bgcolor: theme.palette.ratingButton.activeBackground,
                      borderColor: theme.palette.ratingButton.hoverBorder,
                      transform: 'scale(1.1)',
                    },
                  }),
                  padding: 0,
                }}
              >
                {ratingState === 'dislike' ? 
                  <FaThumbsDown size={14} /> : 
                  <FaRegThumbsDown size={14} color={theme.palette.iconColor} />
                }
              </IconButton>
            </Tooltip>

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
                  bgcolor: theme.palette.ratingButton.background,
                  border: ratingState === 'like' 
                    ? `2px solid ${theme.palette.ratingButton.activeBorder}` 
                    : `2px solid ${theme.palette.ratingButton.border}`,
                  '&:hover': {
                    borderColor: theme.palette.ratingButton.hoverBorder,
                    transform: 'scale(1.1)',
                  },
                  ...(ratingState === 'like' && {
                    bgcolor: theme.palette.ratingButton.activeBackground,
                    '& svg': {
                      color: theme.palette.svgColor,
                    },
                    '&:hover': {
                      bgcolor: theme.palette.ratingButton.activeBackground,
                      borderColor: theme.palette.ratingButton.hoverBorder,
                      transform: 'scale(1.1)',
                    },
                  }),
                  padding: 0,
                }}
              >
                {ratingState === 'like' ? 
                  <FaThumbsUp size={14} /> : 
                  <FaRegThumbsUp size={14} color={theme.palette.iconColor} />
                }
              </IconButton>
            </Tooltip>

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
                  bgcolor: theme.palette.ratingButton.background,
                  border: ratingState === 'love' 
                    ? `2px solid ${theme.palette.ratingButton.activeBorder}` 
                    : `2px solid ${theme.palette.ratingButton.border}`,
                  '&:hover': {
                    borderColor: theme.palette.ratingButton.hoverBorder,
                    transform: 'scale(1.1)',
                  },
                  ...(ratingState === 'love' && {
                    bgcolor: theme.palette.ratingButton.activeBackground,
                    '& svg': {
                      color: theme.palette.svgColor,
                    },
                    '&:hover': {
                      bgcolor: theme.palette.ratingButton.activeBackground,
                      borderColor: theme.palette.ratingButton.hoverBorder,
                      transform: 'scale(1.1)',
                    },
                  }),
                  padding: 0,
                }}
              >
                {ratingState === 'love' ? 
                  <FaHeart size={14} /> : 
                  <FaRegHeart size={14} color={theme.palette.iconColor} />
                }
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

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
              bgcolor: theme.palette.ratingButton.background,
              border: isAddedtoWatchLater
                ? `2px solid ${theme.palette.ratingButton.activeBorder}`
                : `2px solid ${theme.palette.ratingButton.border}`,
              '&:hover': {
                borderColor: theme.palette.ratingButton.hoverBorder,
                transform: 'scale(1.1)',
              },
              ...(isAddedtoWatchLater && {
                bgcolor: theme.palette.ratingButton.activeBackground,
                '& svg': {
                  color: theme.palette.svgColor,
                },
                '&:hover': {
                  bgcolor: theme.palette.ratingButton.activeBackground,
                  borderColor: theme.palette.ratingButton.hoverBorder,
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
          >
            {isAddedtoWatchLater ? 
              <MdWatchLater size={18} /> : 
              <MdOutlineWatchLater size={18} color={theme.palette.iconColor} />
            }
          </IconButton>
        </Tooltip>

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