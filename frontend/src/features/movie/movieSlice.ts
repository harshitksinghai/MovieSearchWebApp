import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  MovieApiItem,
  MovieDbItem,
  MovieDetailsItem,
} from "../../types/movieTypes";
import axios from "axios";
import { RootState } from "../../app/store";

const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

interface MovieState {
  myListState: MovieDetailsItem[];
  error: string | null;
}

const initialState: MovieState = {
  myListState: [],
  error: null,
};

export const fetchMyListState = createAsyncThunk(
  "movie/fetchMyListState",
  async (userId: string) => {
    // Fetch from db
    const dbFetchUrl = `${BACKEND_URL}/api/movies/getlist`;
    const dbResponses = await axios.post<{
      success: boolean;
      movieList: MovieDbItem[];
    }>(dbFetchUrl, { userId });
    const dbMovies = dbResponses.data.movieList;

    // Fetch from OMDB api by imdbId
    const omdbApiUrl = `${BACKEND_URL}/api/movies/imdbid`;
    const omdbRequests = dbMovies.map((movie: MovieDbItem) =>
      axios.post<{ success: boolean; movie: MovieApiItem }>(omdbApiUrl, {
        imdbID: movie.imdbID,
      })
    );
    const omdbResponses = await Promise.all(omdbRequests);

    // Get combined list
    const fetchedMyList: MovieDetailsItem[] = dbMovies.map((dbMovie, index) => {
      const apiData = omdbResponses[index].data.movie;
      return {
        ...dbMovie,
        Title: apiData.Title,
        Year: apiData.Year,
        Rated: apiData.Rated,
        Released: apiData.Released,
        Runtime: apiData.Runtime,
        Genre: apiData.Genre,
        Director: apiData.Director,
        Writer: apiData.Writer,
        Actors: apiData.Actors,
        Plot: apiData.Plot,
        Language: apiData.Language,
        Country: apiData.Country,
        Awards: apiData.Awards,
        Poster: apiData.Poster,
        Ratings: apiData.Ratings,
        Metascore: apiData.Metascore,
        imdbRating: apiData.imdbRating,
        imdbVotes: apiData.imdbVotes,
      };
    });
    return fetchedMyList;
  }
);

export const updateRating = createAsyncThunk(
  "movie/updateRatingInDb",
  async (
    {
      imdbID,
      ratingState,
      Type,
    }: { imdbID: string; ratingState: string; Type: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const userId = state.auth.userId;

    const url = `${BACKEND_URL}/api/movies/updaterating`;
    const requestBody = {
      imdbID,
      ratingState,
      Type,
      userId,
    };
    const response = await axios.post(url, requestBody);

    let result: MovieDetailsItem = response.data.movie;

    const movieExists = state.movie.myListState.some(
      (m) => m.imdbID === imdbID
    );

    if (!movieExists) {
      const omdbApiUrl = `${BACKEND_URL}/api/movies/imdbid`;
      const omdbResponse = await axios.post(omdbApiUrl, { imdbID });
      const apiData = omdbResponse.data.movie;

      result = {
        ...response.data.movie,
        Title: apiData.Title,
        Year: apiData.Year,
        Rated: apiData.Rated,
        Released: apiData.Released,
        Runtime: apiData.Runtime,
        Genre: apiData.Genre,
        Director: apiData.Director,
        Writer: apiData.Writer,
        Actors: apiData.Actors,
        Plot: apiData.Plot,
        Language: apiData.Language,
        Country: apiData.Country,
        Awards: apiData.Awards,
        Poster: apiData.Poster,
        Ratings: apiData.Ratings,
        Metascore: apiData.Metascore,
        imdbRating: apiData.imdbRating,
        imdbVotes: apiData.imdbVotes,
      };
    }

    console.log("movieSlice => updateRating asyncThunk response: ", result);

    return result;
  }
);

export const addToWatchLater = createAsyncThunk(
  "movie/addToWatchLater",
  async (
    {
      imdbID,
      ratingState,
      Type,
    }: { imdbID: string; ratingState: string; Type: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const userId = state.auth.userId;

    const url = `${BACKEND_URL}/api/movies/addtowatchlater`;
    const requestBody = {
      imdbID,
      ratingState,
      Type,
      userId,
    };
    const response = await axios.post(url, requestBody);

    let result: MovieDetailsItem = response.data.movie;

    const movieExists = state.movie.myListState.some(
      (m) => m.imdbID === imdbID
    );

    if (!movieExists) {
      const omdbApiUrl = `${BACKEND_URL}/api/movies/imdbid`;
      const omdbResponse = await axios.post(omdbApiUrl, { imdbID });
      const apiData = omdbResponse.data.movie;

      // Return combined data
      result = {
        ...response.data.movie,
        Title: apiData.Title,
        Year: apiData.Year,
        Rated: apiData.Rated,
        Released: apiData.Released,
        Runtime: apiData.Runtime,
        Genre: apiData.Genre,
        Director: apiData.Director,
        Writer: apiData.Writer,
        Actors: apiData.Actors,
        Plot: apiData.Plot,
        Language: apiData.Language,
        Country: apiData.Country,
        Awards: apiData.Awards,
        Poster: apiData.Poster,
        Ratings: apiData.Ratings,
        Metascore: apiData.Metascore,
        imdbRating: apiData.imdbRating,
        imdbVotes: apiData.imdbVotes,
      };
    }

    console.log("movieSlice => addToWatchLater asyncThunk response: ", result);

    return result;
  }
);

export const removeFromWatchedList = createAsyncThunk(
  "movie/removeFromWatchedList",
  async (imdbID: string, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth.userId;

    const url = `${BACKEND_URL}/api/movies/removefromwatched`;
    const requestBody = {
      imdbID,
      userId,
    };
    const response = await axios.post(url, requestBody);

    console.log(
      "movieSlice => removeFromWatchedList asyncThunk Response:",
      response.data.success
    );
    return { success: response.data.success, imdbID: imdbID };
  }
);

export const removeFromWatchLater = createAsyncThunk(
  "movie/removeFromWatchLater",
  async (imdbID: string, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth.userId;

    const url = `${BACKEND_URL}/api/movies/removefromwatchlater`;
    const requestBody = {
      imdbID,
      userId,
    };
    const response = await axios.post(url, requestBody);
    console.log(
      "movieSlice => removeFromWatchLater asyncThunk Response: ",
      response.data.success
    );
    return { success: response.data.success, imdbID: imdbID };
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyListState.fulfilled, (state, action) => {
        state.myListState = action.payload;
        state.error = null;
      })
      .addCase(fetchMyListState.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "Something went wrong. Please try again later.";
        console.log(
          "movieSlice => fetchMyListState.rejected => Failed to populate myListState, got error: ",
          state.error
        );
      })

      .addCase(updateRating.fulfilled, (state, action) => {
        const movie = action.payload;
        const imdbID = movie.imdbID;

        const existingMovieIndex = state.myListState.findIndex(
          (m) => m.imdbID === imdbID
        );

        if (existingMovieIndex === -1) {
          state.myListState.push(movie);
        } else {
          state.myListState[existingMovieIndex] = {
            ...state.myListState[existingMovieIndex],
            ratingState: movie.ratingState,
            addToWatchedList: movie.addToWatchedList,
            addToWatchLater: null,
          };
        }
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "Something went wrong. Please try again later.";
        console.log(
          "movieSlice => updateRating.rejected => Failed to update rating, got error: ",
          state.error
        );
      })

      .addCase(addToWatchLater.fulfilled, (state, action) => {
        const movie = action.payload;
        const imdbID = movie.imdbID;

        const existingMovieIndex = state.myListState.findIndex(
          (m) => m.imdbID === imdbID
        );

        if (existingMovieIndex === -1) {
          state.myListState.push(movie);
        } else {
          state.myListState[existingMovieIndex] = {
            ...state.myListState[existingMovieIndex],
            addToWatchLater: movie.addToWatchLater,
          };
        }
      })
      .addCase(addToWatchLater.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "Something went wrong. Please try again later.";
        console.log(
          "movieSlice => addToWatchLater.rejected => Failed to add to watch later, got error: ",
          state.error
        );
      })

      .addCase(removeFromWatchedList.fulfilled, (state, action) => {
        const { imdbID } = action.payload;
        state.myListState = state.myListState.filter((movie) => {
          if (movie.imdbID === imdbID) {
            if (movie.addToWatchLater === null) {
              return false;
            }
            movie.addToWatchedList = null;
            movie.ratingState = "none";
          }
          return true;
        });
      })
      .addCase(removeFromWatchedList.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "Something went wrong. Please try again later.";
        console.log(
          "movieSlice => removeFromWatchedList.rejected => Failed to remove from watched list, got error: ",
          state.error
        );
      })

      .addCase(removeFromWatchLater.fulfilled, (state, action) => {
        const { imdbID } = action.payload;
        state.myListState = state.myListState.filter((movie) => {
          if (movie.imdbID === imdbID) {
            if (movie.addToWatchedList === null) {
              console.log("time to delete");
              return false;
            }
            movie.addToWatchLater = null;
          }
          return true;
        });
      })
      .addCase(removeFromWatchLater.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "Something went wrong. Please try again later.";
        console.log(
          "movieSlice => removeFromWatchLater.rejected => Failed to remove from watch later list, got error: ",
          state.error
        );
      });
  },
});

export const {} = movieSlice.actions;
export default movieSlice.reducer;
