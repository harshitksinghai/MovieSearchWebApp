import React from 'react';
import { Box, Skeleton } from "@mui/material";
import MovieCarousel from "./MovieCarousel";

interface Movie {
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  imdbID: string;
}

interface HomeMovieListProps {
  movies: Movie[];
  loading: boolean;
}

const SkeletonRow = () => (
  <Box
    sx={{
      display: 'flex',
      gap: 2,
      px: 2,
      overflowX: 'hidden',
      mb: 4
    }}
  >
    {[...Array(5)].map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        width={200}
        height={300}
        sx={{
          borderRadius: 1,
          flexShrink: 0
        }}
      />
    ))}
  </Box>
);

const HomeMovieList: React.FC<HomeMovieListProps> = ({ movies, loading }) => {
  const latestMovies = movies.filter(movie => movie.Type === 'movie');
  const latestSeries = movies.filter(movie => movie.Type === 'series');

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <SkeletonRow />
        <SkeletonRow />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <MovieCarousel title="Popular Movies" movies={latestMovies} />
      <MovieCarousel title="Popular Series" movies={latestSeries} />
    </Box>
  );
};

export default HomeMovieList;