import axios from "axios";

export interface MovieItem {
  imdbID: string;
  addToWatchedList: string; // ISO date string
  addToWatchLater: string; // ISO date string
  ratingState: "none" | "dislike" | "like" | "love";
  Type: "none" | "movie" | "series" | "game";
}
export interface MovieItemResponse {
  imdbid: string;
  addtowatchedlist: string; // ISO date string
  addtowatchlater: string; // ISO date string
  ratingstate: "none" | "dislike" | "like" | "love";
  type: "All" | "Movies" | "Series" | "Games";
}


const MODE = import.meta.env.MODE || "development"; 
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_LOCAL;

// Search and fetch functions
export const fetchMovies = async (t: (key: string) => string, query?: string, year?: string, type?: string, page: number = 1) => {
  console.log('Fetching with params:', { query, year, type, page });

  if (query) {
    try {
      // Use backend API with POST request and request body
      const url = `${BACKEND_URL}/api/movies/search`;
      const requestBody = {
        query,
        year,
        type,
        page
      };

      console.log('Request URL:', url);
      console.log('Request Body:', requestBody);
      
      const response = await axios.post(url, requestBody);
      console.log('API Response:', response);

      if (response.data.success) {
        return {
          movies: response.data.movies,
          totalPages: response.data.totalPages,
          error: null
        };
      }
      
      return { 
        movies: [], 
        totalPages: 1, 
        error: t('error.NoMoviesFound')
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return { 
        movies: [], 
        totalPages: 1, 
        error: t('error.NoMoviesFound')
      };
    }
  }
  
  else {
    try {
      // Fetch popular movies/series from the backend using POST
      const url = `${BACKEND_URL}/api/movies/popular`;
      const requestBody = { type };
      
      const response = await axios.post(url, requestBody);
      console.log('API Popular Results:', response);

      if (response.data.success) {
        return {
          movies: response.data.movies,
          totalPages: 1,
          error: null
        };
      }
      
      return {
        movies: [],
        totalPages: 1,
        error: t('error.fetchFailed')
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return {
        movies: [],
        totalPages: 1,
        error: t('error.fetchFailed')
      };
    }
  }
};

export const fetchMoviesByImdbId = async (t: (key: string) => string, imdbID: string) => {
  if(imdbID){
    try {
      // Use backend API endpoint with POST request
      const url = `${BACKEND_URL}/api/movies/imdbid`;
      const requestBody = { imdbID };

      console.log('imdbid Request URL:', url);
      console.log('imdbid Request Body:', requestBody);
      
      const response = await axios.post(url, requestBody);
      console.log('imdbid API Response:', response);

      if (response.data.success) {
        return {
          movie: response.data.movie,
          error: null
        };
      }
      
      return { 
        movie: null, 
        error: t('error.NoMoviesFound')
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return { 
        movie: null, 
        error: t('error.fetchFailed')
      };
    }
  }
  
  return {
    movie: null,
    error: t('error.InvalidImdbId')
  };
};

// Movie list management functions
export const getMovieList = async () => {
  try {
    const url = `${BACKEND_URL}/api/movies/getlist`;
    console.log('getMovieList Request URL:', url);

    const response = await axios.post(url);
    console.log('getMovieList API Response:', response);

    if (response.data.success) {
      return response.data.movieList;
    }
    return [];
  } catch (error) {
    console.error('Error fetching movie list:', error);
    return [];
  }
};

export const addToList = async (
  imdbID: string, 
  ratingState: "none" | "dislike" | "like" | "love", 
  Type: "movie" | "series" | "game",
  isAddToWatchedList: boolean, 
  isAddToWatchLater: boolean
) => {
  try {
    const url = `${BACKEND_URL}/api/movies/addtolist`;
    const requestBody = {
      imdbID,
      ratingState,
      Type,
      isAddToWatchedList,
      isAddToWatchLater
    };

    const response = await axios.post(url, requestBody);
    console.log('addToList API Response:', response);
    return response.data.success;
  } catch (error) {
    console.error('Error adding to list:', error);
    return false;
  }
};

export const removeFromWatchedList = async (imdbID: string) => {
  try {
    const url = `${BACKEND_URL}/api/movies/removefromwatched`;
    const requestBody = { imdbID };

    const response = await axios.post(url, requestBody);
    console.log('removeFromWatchedList API Response:', response);
    return response.data.success;
  } catch (error) {
    console.error('Error removing from watched list:', error);
    return false;
  }
};

export const removeFromWatchLater = async (imdbID: string) => {
  try {
    const url = `${BACKEND_URL}/api/movies/removefromwatchlater`;
    const requestBody = { imdbID };

    const response = await axios.post(url, requestBody);
    console.log('removeFromWatchLater API Response:', response);
    return response.data.success;
  } catch (error) {
    console.error('Error removing from watch later list:', error);
    return false;
  }
};

export const updateRating = async (
  imdbID: string, 
  ratingState: "none" | "dislike" | "like" | "love", 
  Type: "movie" | "series" | "game"
) => {
  try {
    const url = `${BACKEND_URL}/api/movies/updaterating`;
    const requestBody = {
      imdbID,
      ratingState,
      Type
    };

    const response = await axios.post(url, requestBody);
    console.log('updateRating API Response:', response);
    return response.data.success;
  } catch (error) {
    console.error('Error updating rating:', error);
    return false;
  }
};

export const addToWatchLater = async (
  imdbID: string, 
  ratingState: "none" | "dislike" | "like" | "love", 
  Type: "movie" | "series" | "game"
) => {
  try {
    const url = `${BACKEND_URL}/api/movies/addtowatchlater`;
    const requestBody = {
      imdbID,
      ratingState,
      Type
    };

    const response = await axios.post(url, requestBody);
    console.log('addToWatchLater API Response:', response);
    return response.data.success;
  } catch (error) {
    console.error('Error adding to watch later:', error);
    return false;
  }
};