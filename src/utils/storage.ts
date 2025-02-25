import { fetchMoviesByImdbId } from "../api/api";

export interface MovieItem {
  imdbID: string;
  Type: string;
  Year: string;
  addedToList: string; // ISO date string
  ratingState: "none" | "dislike" | "like" | "love";
  genre: string[];
  language: string;
  title: string;
}

export interface GenreCount {
  [key: string]: number;
}

const STORAGE_KEYS = {
  MOVIE_LIST: "movieList",
  GENRE_COUNT: "genreCount",
} as const;

export const addToList = async (imdbId: string): Promise<void> => {
  const movieList = getMovieList();
  const genreCount = getGenreCount();

  const result = await fetchMoviesByImdbId(imdbId);
  const movie: any = result?.movie;
  const error = result?.error;

  // Create new movie item
  const newMovie: MovieItem = {
    imdbID: movie.imdbID,
    Type: movie.Type,
    Year: movie.Year.split("–")[0],
    addedToList: new Date().toISOString(),
    ratingState: "none",
    genre: movie.Genre?.split(", ") || [],
    language: movie.Language,
    title: movie.Title,
  };

  // Update genre count
  newMovie.genre.forEach((genre) => {
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  // Add movie to start of list for recent-first ordering
  movieList.unshift(newMovie);

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(movieList));
  localStorage.setItem(STORAGE_KEYS.GENRE_COUNT, JSON.stringify(genreCount));
};

export const removeFromList = (imdbID: string): void => {
  const movieList = getMovieList();
  const genreCount = getGenreCount();

  // Find movie to remove
  const movieToRemove = movieList.find((movie) => movie.imdbID === imdbID);

  if (movieToRemove) {
    // Decrease genre counts
    movieToRemove.genre.forEach((genre) => {
      genreCount[genre]--;
      if (genreCount[genre] === 0) {
        delete genreCount[genre];
      }
    });

    // Remove movie from list
    const updatedList = movieList.filter((movie) => movie.imdbID !== imdbID);

    // Save updated data
    localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
    localStorage.setItem(STORAGE_KEYS.GENRE_COUNT, JSON.stringify(genreCount));
  }
};

export const updateRating = (
  imdbID: string,
  rating: MovieItem["ratingState"]
): void => {
  const movieList = getMovieList();
  const updatedList = movieList.map((movie) =>
    movie.imdbID === imdbID ? { ...movie, ratingState: rating } : movie
  );

  localStorage.setItem(STORAGE_KEYS.MOVIE_LIST, JSON.stringify(updatedList));
};

export const getMovieList = (): MovieItem[] => {
  const list = localStorage.getItem(STORAGE_KEYS.MOVIE_LIST);
  return list ? JSON.parse(list) : [];
};

export const getGenreCount = (): GenreCount => {
  const count = localStorage.getItem(STORAGE_KEYS.GENRE_COUNT);
  return count ? JSON.parse(count) : {};
};

export const getUniqueLanguages = (): string[] => {
  const movieList = getMovieList();
  return Array.from(new Set(movieList.map((movie) => movie.language)));
};

export const getUniqueYears = (): string[] => {
  const movieList = getMovieList();
  return Array.from(new Set(movieList.map((movie) => movie.Year)))
    .sort()
    .reverse();
};
