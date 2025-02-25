import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMoviesByImdbId } from '../api/api';
import { useTranslation } from 'react-i18next';
import './MovieDetails.css';
import MovieDetailsNavbar from './SubNavBar';
import { ThemeContext } from '../theme/ThemeContext';

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
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetchMoviesByImdbId(t, id)
        .then((response) => {
          // Handle the case where response might be undefined
          if (response) {
            setMovieResponse(response);
          } else {
            // Create a default error response if undefined is returned
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
      <div className={`loading-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!movieResponse || movieResponse.error || !movieResponse.movie) {
    return (
      <div className={`error-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2>{t('error.movieNotFound')}</h2>
        <p>{movieResponse?.error || t('error.unknownError')}</p>
      </div>
    );
  }

  const movie = movieResponse.movie;
  console.log("movie details imdbid: " + movie.imdbID) 
  return (
    <>
      <MovieDetailsNavbar />
      <div className={`movie-details-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>


        <div className="movie-content">
          <div className="movie-poster-container">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-poster.jpg'}
              alt={movie.Title}
              className="movie-poster"
            />
          </div>

          <div className="movie-info">
            <h1 className="movie-title">
              {movie.Title}
              <span className="movie-year">({movie.Year})</span>
            </h1>

            <div className="movie-meta">
              <span className="movie-runtime">{movie.Runtime}</span>
              <span className="divider">•</span>
              <span className="movie-release">{movie.Released}</span>
            </div>

            <div className="movie-genres">
              {movie.Genre.split(', ').map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
              <div className="vertical-separator"></div>
              <button className='imdb' onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank")}>IMDB</button>

            </div>

            <div className="movie-section">
              <h3>{t('movie.plot')}</h3>
              <p className="movie-plot">{movie.Plot}</p>
            </div>

            <div className="movie-details-grid">
              <div className="detail-item">
                <h3>{t('movie.director')}</h3>
                <p>{movie.Director}</p>
              </div>

              <div className="detail-item">
                <h3>{t('movie.cast')}</h3>
                <p>{movie.Actors}</p>
              </div>

              <div className="detail-item">
                <h3>{t('movie.language')}</h3>
                <p>{movie.Language}</p>
              </div>
            </div>

            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="movie-ratings-section">
                <h3 className='ratingsh3'>{t('movie.ratings')}</h3>
                <div className="ratings-container">
                  {movie.Ratings.map((rating, index) => (
                    <div key={index} className="rating-item">
                      <span className="rating-source">{rating.Source}</span>
                      <span className="rating-value">{rating.Value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </>
  );
};

export default MovieDetails;