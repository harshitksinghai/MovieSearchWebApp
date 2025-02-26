import React from 'react'
import styles from './SearchResults.module.css'
import MovieCard from './MovieCard';
import { Box, Skeleton, Pagination } from "@mui/material";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../context/SearchContext';

interface ShowMoviesProps {
  movies: any[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const SearchResults: React.FC<ShowMoviesProps> = ({
  movies,
  loading,
  page,
  totalPages,
  onPageChange
}) => {

  const { handleSearchState, handleError, handleTitle } = useSearch();
  const { t } = useTranslation();
  const handleNavLinkClick = () => {
    handleSearchState(false);
    handleError(null);
    handleTitle('');
  };

  return (
    <div className={styles["search-container"]}>
      {loading ? (
        <div className={styles["skeleton-grid"]}>
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
      ) : movies.length > 0 ? (
        <div className={styles["search-results-container"]}>
          <div className={styles["movies-grid"]}>
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles["no-results"]}>
          <p>
            {t('search.tryAgain')}{" "}
            <Link to="/home" className={styles["nav-link"]} onClick={handleNavLinkClick}>{t('search.goHome')}</Link> {t('search.or')}{" "}
            <Link to="/mylist" className={styles["nav-link"]} onClick={handleNavLinkClick}>{t('search.goMyList')}</Link>.
          </p>
        </div>
      )}

      {totalPages > 1 && movies.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <Pagination
            variant="outlined"
            shape="rounded"
            count={totalPages}
            page={page}
            onChange={onPageChange}
          />
        </Box>
      )}
    </div>
  );
};

export default SearchResults;