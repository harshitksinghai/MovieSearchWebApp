import { useEffect, useState } from 'react';
import './MovieCard.css';
import placeholder from "../assets/placeholder1.jpg";
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegHeart, FaHeart, FaPlus, FaCheck } from "react-icons/fa6";
import { removeFromList, addToList, updateRating, getMovieList } from '../utils/localStorage';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: any;
  onListChange?: () => void; // Optional callback prop
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onListChange }) => {
  const {t} = useTranslation();
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

  // Notify parent components about changes
  const notifyChange = () => {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('movieListChanged'));
    
    // Call callback if provided
    if (onListChange) {
      onListChange();
    }
  };

  const handleRating = (rating: 'dislike' | 'like' | 'love') => {
    const newRating = rating === ratingState ? 'none' : rating;
    setRatingState(newRating);
    
    if (isAddedToList) {
      updateRating(movie.imdbID, newRating);
      // notifyChange(); // Notify about rating change
    }
  };

  const handleAddToList = () => {
    if (isAddedToList) {
      removeFromList(movie.imdbID);
    } else {
      addToList(movie.imdbID, ratingState, movie.Type);
    }
    setIsAddedToList(!isAddedToList);
    
    notifyChange(); // Notify about list change
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
    <div className="movie-card">
      <Link to={`/movie/${movie.imdbID}`} className="movie-link">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : placeholder}
        alt={movie.Title}
        className="movie-poster"
      />
      </Link>
      <div className="card-overlay">
        <div className="rating-container">
          <button
            className={`action-button ${(ratingState !== 'none') ? 'active' : ''}`}
          >
            {ratingIcon}
          </button>

          <div className="rating-options">
            <button
              className={`action-button ${ratingState === 'dislike' ? 'active' : ''}`}
              onClick={() => handleRating('dislike')}
            >
              {ratingState === 'dislike' ? 
              <FaThumbsDown size={14} /> : 
              <FaRegThumbsDown size={14} color="white" />
            }
              <span className="tooltip">{t('card.dislikeTooltip')}</span>
            </button>
            <button
            className={`action-button ${ratingState === 'like' ? 'active' : ''}`}
            onClick={() => handleRating('like')}
          >
            {ratingState === 'like' ? 
              <FaThumbsUp size={14} /> : 
              <FaRegThumbsUp size={14} color="white" />
            }
            <span className="tooltip">{t('card.likeTooltip')}</span>
          </button>
            <button
              className={`action-button ${ratingState === 'love' ? 'active' : ''}`}
              onClick={() => handleRating('love')}
            >
              {ratingState === 'love' ? 
              <FaHeart size={14} /> : 
              <FaRegHeart size={14} color="white" />
            }
              <span className="tooltip">{t('card.loveTooltip')}</span>
            </button>
          </div>
        </div>

        <button
          className={`action-button ${isAddedToList ? 'active' : ''}`}
          onClick={handleAddToList}
        >
          {isAddedToList ? 
            <FaCheck size={14} /> : 
            <FaPlus size={14} color="white" />
          }
          <span className="tooltip">{isAddedToList ? t('card.removeListTooltip') : t('card.addListTooltip')}</span>
        </button>


        <div className="movie-info">
          <p>{movie.Type.toUpperCase()}</p>
          <p>{movie.Year}</p>
        </div>

      </div>
    </div>
  );
};

export default MovieCard;