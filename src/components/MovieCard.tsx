import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Tooltip, Stack } from '@mui/material';
import placeholder from "../assets/placeholder1.jpg";
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegHeart, FaHeart, FaPlus, FaCheck } from "react-icons/fa6";
import { removeFromList, addToList, updateRating, getMovieList } from '../utils/localStorage';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: any;
  onListChange?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onListChange }) => {
  const { t } = useTranslation();
  const [ratingState, setRatingState] = useState<'none' | 'dislike' | 'like' | 'love'>('none');
  const [isAddedToList, setIsAddedToList] = useState(false);

  useEffect(() => {
    const movieList = getMovieList();
    const storedMovie = movieList.find((m) => m.imdbID === movie.imdbID);
    if (storedMovie) {
      setIsAddedToList(true);
      setRatingState(storedMovie.ratingState);
    } else {
      setIsAddedToList(false);
      setRatingState('none');
    }
  }, [movie.imdbID]);

  const notifyChange = () => {
    window.dispatchEvent(new CustomEvent('movieListChanged'));
    
    if (onListChange) {
      onListChange();
    }
  };

  const handleRating = (rating: 'dislike' | 'like' | 'love') => {
    const newRating = rating === ratingState ? 'none' : rating;
    setRatingState(newRating);
    
    if (isAddedToList) {
      updateRating(movie.imdbID, newRating);
      notifyChange();
    }
  };

  const handleAddToList = () => {
    if (isAddedToList) {
      removeFromList(movie.imdbID);
    } else {
      addToList(movie.imdbID, ratingState, movie.Type);
    }
    setIsAddedToList(!isAddedToList);
    
    notifyChange();
  };

  let ratingIcon;
  if (ratingState === 'none') {
    ratingIcon = <FaRegThumbsUp size={14} color="white" />;
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
        bgcolor: '#18181b',
        width: 250,
        height: 300,
        borderRadius: 2,
        overflow: 'visible',
        transition: 'all 0.3s ease',
        boxShadow: '2px 2px 10px rgba(26, 26, 26, 0.495)',
        '&:hover': {
          transform: 'scale(1.05)',
          zIndex: 10,
          '& .card-overlay': {
            opacity: 1,
          },
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
          bgcolor: '#181818',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '9px',
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
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
              bgcolor: '#2f2f2f',
              border: ratingState !== 'none' ? '2px solid white' : '2px solid #636363',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#ffffff',
                transform: 'scale(1.1)',
              },
              ...(ratingState !== 'none' && {
                bgcolor: 'white',
                '& svg': {
                  color: '#181818',
                },
                '&:hover': {
                  bgcolor: 'white', 
                  borderColor: '#ffffff',
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
              bgcolor: 'rgba(42, 42, 42, 0.9)',
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
                  bgcolor: '#2f2f2f',
                  border: ratingState === 'dislike' ? '2px solid white' : '2px solid #636363',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#ffffff',
                    transform: 'scale(1.1)',
                  },
                  ...(ratingState === 'dislike' && {
                    bgcolor: 'white',
                    '& svg': {
                      color: '#181818',
                    },
                    '&:hover': {
                      bgcolor: 'white', // Keep the background white on hover when active
                      borderColor: '#ffffff',
                      transform: 'scale(1.1)',
                    },
                  }),
                  padding: 0,
                }}
              >
                {ratingState === 'dislike' ? 
                  <FaThumbsDown size={14} /> : 
                  <FaRegThumbsDown size={14} color="white" />
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
                  bgcolor: '#2f2f2f',
                  border: ratingState === 'like' ? '2px solid white' : '2px solid #636363',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#ffffff',
                    transform: 'scale(1.1)',
                  },
                  ...(ratingState === 'like' && {
                    bgcolor: 'white',
                    '& svg': {
                      color: '#181818',
                    },
                    '&:hover': {
                      bgcolor: 'white', // Keep the background white on hover when active
                      borderColor: '#ffffff',
                      transform: 'scale(1.1)',
                    },
                  }),
                  padding: 0,
                }}
              >
                {ratingState === 'like' ? 
                  <FaThumbsUp size={14} /> : 
                  <FaRegThumbsUp size={14} color="white" />
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
                  bgcolor: '#2f2f2f',
                  border: ratingState === 'love' ? '2px solid white' : '2px solid #636363',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#ffffff',
                    transform: 'scale(1.1)',
                  },
                  ...(ratingState === 'love' && {
                    bgcolor: 'white',
                    '& svg': {
                      color: '#181818',
                    },
                    '&:hover': {
                      bgcolor: 'white', // Keep the background white on hover when active
                      borderColor: '#ffffff',
                      transform: 'scale(1.1)',
                    },
                  }),
                  padding: 0,
                }}
              >
                {ratingState === 'love' ? 
                  <FaHeart size={14} /> : 
                  <FaRegHeart size={14} color="white" />
                }
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Tooltip
          title={isAddedToList ? t('card.removeListTooltip') : t('card.addListTooltip')}
          placement="top"
          arrow
          >
          <IconButton
            className={`action-button ${isAddedToList ? 'active' : ''}`}
            onClick={handleAddToList}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#2f2f2f',
              border: '2px solid #636363',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#ffffff',
                transform: 'scale(1.1)',
              },
              ...(isAddedToList && {
                bgcolor: 'white',
                border: '2px solid white',
                '& svg': {
                  color: '#181818',
                },
                '&:hover': {
                  bgcolor: 'white', // Keep the background white on hover when active
                  borderColor: '#ffffff',
                  transform: 'scale(1.1)',
                },
              }),
              padding: 0,
            }}
          >
            {isAddedToList ? 
              <FaCheck size={14} /> : 
              <FaPlus size={14} color="white" />
            }
          </IconButton>
        </Tooltip>

        <Box
          className="movie-info"
          sx={{
            marginLeft: 'auto',
            color: 'white',
            textAlign: 'right',
          }}
        >
          <Typography
            sx={{
              margin: '3px 0',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {movie.Type.toUpperCase()}
          </Typography>
          <Typography
            sx={{
              margin: '3px 0',
              fontSize: 13,
              fontWeight: 500,
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