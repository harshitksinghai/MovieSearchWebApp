import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMoviesByImdbId } from '../api/api';
import { useTranslation } from 'react-i18next';
import styles from './MovieDetails.module.css';
import SubNavbar from './SubNavBar';
import { ThemeContext } from '../theme/ThemeContext';
import clsx from 'clsx';

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
      <div className={clsx(styles["loading-container"], darkMode ? styles['dark-mode'] : styles['light-mode'])}>
        <div className={styles["loading-spinner"]}></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!movieResponse || movieResponse.error || !movieResponse.movie) {
    return (
      <div className={clsx(styles["error-container"], darkMode ? styles['dark-mode'] : styles['light-mode'])}>
        <h2>{t('error.movieNotFound')}</h2>
        <p>{movieResponse?.error || t('error.unknownError')}</p>
      </div>
    );
  }

  const movie = movieResponse.movie;
  console.log("movie details imdbid: " + movie.imdbID) 
  return (
    <>
      <SubNavbar />
      <div className={clsx(styles["movie-details-container"], darkMode ? styles['dark-mode'] : styles['light-mode'])}>


        <div className={styles["movie-content"]}>
          <div className={styles["movie-details-poster-container"]}>
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-poster.jpg'}
              alt={movie.Title}
              className={styles["movie-details-poster"]}
            />
          </div>

          <div className={styles["movie-info"]}>
            <h1 className={styles["movie-title"]}>
              {movie.Title}
              <span className={styles["movie-year"]}>({movie.Year})</span>
            </h1>

            <div className={styles["movie-meta"]}>
              <span className={styles["movie-runtime"]}>{movie.Runtime}</span>
              <span className={styles["divider"]}>•</span>
              <span className={styles["movie-release"]}>{movie.Released}</span>
            </div>

            <div className={styles["movie-genres"]}>
            <button className={styles.imdb} onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank")}>IMDB</button>
            <div className={styles["vertical-separator"]}></div>

              {movie.Genre.split(', ').map((genre, index) => (
                <span key={index} className={styles["genre-tag"]}>{genre}</span>
              ))}

            </div>

            <div className={styles["movie-section"]}>
              <h3>{t('movie.plot')}</h3>
              <p className={styles["movie-plot"]}>{movie.Plot}</p>
            </div>

            <div className={styles["movie-details-grid"]}>
              <div className={styles["detail-item"]}>
                <h3>{t('movie.director')}</h3>
                <p>{movie.Director}</p>
              </div>

              <div className={styles["detail-item"]}>
                <h3>{t('movie.cast')}</h3>
                <p>{movie.Actors}</p>
              </div>

              <div className={styles["detail-item"]}>
                <h3>{t('movie.language')}</h3>
                <p>{movie.Language}</p>
              </div>
            </div>

            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className={styles["movie-ratings-section"]}>
                <h3 className={styles.ratingsh3}>{t('movie.ratings')}</h3>
                <div className={styles["ratings-container"]}>
                  {movie.Ratings.map((rating, index) => (
                    <div key={index} className={styles["rating-item"]}>
                      <span className={styles["rating-source"]}>{rating.Source}</span>
                      <span className={styles["rating-value"]}>{rating.Value}</span>
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