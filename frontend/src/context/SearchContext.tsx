// src/context/SearchContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { fetchMovies } from '../api/api';
import { useTranslation } from 'react-i18next';

interface SearchContextType {
  movies: any[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  searchParams: {
    query: string;
    year: string;
    type: string;
  };
  searchState: boolean;
  title: string,
  handleTitle: (value: string) => void;
  handleSearchState: (value: boolean) => void;
  handleError: (value: string | null) => void;
  handleSearch: (query: string, year: string, type: string) => void;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParams, setSearchParams] = useState<any>({ query: "", year: "", type: "" });
  const [searchState, setSearchState] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const { t } = useTranslation();

  const handleSearchState = (value: boolean) => {
    setSearchState(value);
  }
  const handleError = (value: string | null) => {
    setError(value);
  }
  const handleTitle = (value: string) => {
    setTitle(value);
  }

  const fetchHomeMovieList = async () => {
    setLoading(true);
    try {
      const moviesResult = await fetchMovies(t, "", "", "movie");
      const seriesResult = await fetchMovies(t, "", "", "series");

      const combinedMovies = [
        ...(moviesResult.movies || []),
        ...(seriesResult.movies || [])
      ];

      setMovies(combinedMovies);
      setError(null);
    } catch (err) {
      console.error('Error fetching home movie list:', err);
      setError(t('error.fetchFailed'));
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieResults = async (query: string, year: string, type: string, currentPage: number = 1) => {
    if (!query && !year && !type) {
      setError(t('error.fillSearch'));
      setMovies([]);
      setSearchState(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchMovies(t, query, year, type, currentPage);
      setMovies(result.movies || []);
      setTotalPages(result.totalPages);
      setError(result.error);
    } catch (err) {
      console.error('Search Error:', err);
      setError(t('error.somethingWentWrong'));
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, year: string, type: string) => {
    setSearchParams({ query, year, type });
    
    if (query.trim() || year.trim() || type) {
        setSearchState(true);
        setPage(1);
        fetchMovieResults(query, year, type, 1);
    } else {
        setSearchState(false);
        console.log("pikacuuuu")
        fetchHomeMovieList();
    }
};

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchMovieResults(searchParams.query, searchParams.year, searchParams.type, value);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        movies, 
        loading, 
        error, 
        page, 
        totalPages, 
        searchParams, 
        searchState,
        title,
        handleTitle,
        handleSearchState,
        handleError,
        handleSearch,
        handlePageChange
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};