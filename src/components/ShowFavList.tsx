import { useEffect, useState } from 'react';
import { MovieItem } from '../utils/localStorage';
import MovieCard from './MovieCard';
import './ShowFavList.css'
import { fetchMoviesByImdbId } from '../api/api';
import { useTranslation } from 'react-i18next';
import { Skeleton } from "@mui/material";

interface SimplifiedMovie {
  Type: string;
  imdbID: string;
  Poster: string;
  Year: string;
  Title: string;
  ratingState: string;
}

interface ShowFavListProps {
  filteredList: MovieItem[];
  refreshList: () => void;
}

const ShowFavList: React.FC<ShowFavListProps> = ({filteredList, refreshList}) => {
  const {t} = useTranslation();
  const [filteredMovies, setFilteredMovies] = useState<SimplifiedMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const simplifiedResults: SimplifiedMovie[] = [];
        
        for (const movie of filteredList) {
          try {
            console.log("about to fetchMoviesByImdbId");
            const result = await fetchMoviesByImdbId(t, movie.imdbID);
            console.log(`This is by IMDBID result: ${result}`)
            if (result && result.movie.Response === "True") {
              // Extract only the fields we need
              const simplifiedMovie: SimplifiedMovie = {
                Type: result.movie.Type,
                imdbID: result.movie.imdbID || movie.imdbID,
                Poster: result.movie.Poster || 'N/A',
                Year: result.movie.Year || 'N/A',
                Title: result.movie.Title || 'Unknown Title',
                ratingState: movie.ratingState
              };
              
              simplifiedResults.push(simplifiedMovie);
            }
          } catch (err) {
            console.error(`Failed to fetch movie ${movie.imdbID}:`, err);
          }
        }
        
        setFilteredMovies(simplifiedResults);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(t('error.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (filteredList.length > 0) {
      fetchMovieDetails();
    } else {
      setFilteredMovies([]);
      setLoading(false);
    }
  }, [filteredList, t]); // Re-run when filteredList or t changes

  // if (loading) {
  //   return <div className="loading">{t('fav.loading')}</div>;
  // }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (filteredList.length === 0) {
    return <div className="empty-list">{t('fav.empty')}</div>;
  }

  return (
    <div>
      
    {loading ? (
      <div className="skeleton-grid">
        {[...Array(10)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={250}
            height={300}
            sx={{
              bgcolor: 'grey.700',
              borderRadius: '8px'
            }}
          />
        ))}
      </div>
    ) : (
    <div className="search-container">
      <div className="search-results-container">
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} onListChange={refreshList}/>
          ))}
        </div>
      </div>
    </div>
        )}
        </div>
  );
};

export default ShowFavList;
