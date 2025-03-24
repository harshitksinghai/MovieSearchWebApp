import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MovieApiItem,
  MovieDbItem,
  MovieDetailsItem,
} from "../../types/movieTypes";
import axios from "axios";
import { RootState } from "../../app/store";
import { comedyTitles, romanceTitles, thrillerTitles, trendingTitles } from "@/utils/movieTitles";
import { logout } from "../auth/authSlice.ts";

const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

interface MovieState {
  myListState: MovieDetailsItem[];
  trendingListState: MovieDetailsItem[];
  thrillerListState: MovieDetailsItem[];
  comedyListState: MovieDetailsItem[];
  romanceListState: MovieDetailsItem[];
  error: string | null;
  loading: boolean;
}

const initialState: MovieState = {
  myListState: [],
  trendingListState: [],
  thrillerListState: [],
  comedyListState: [],
  romanceListState: [],
  error: null,
  loading: false
};

export const fetchMyListState = createAsyncThunk(
  "movie/fetchMyListState",
  async (userId: string | null) => {
    if(!userId){
      return [];
    }
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
        totalSeasons: apiData.totalSeasons
      };
    });
    return fetchedMyList;
  }
);

export const fetchHomeListStates = createAsyncThunk(
  'movie/fetchHomeListStates',
  async (_, {getState}) => {
    const state = getState() as RootState;
    const myListState = state.movie.myListState;

    const myListMap = new Map<string, MovieDetailsItem>();
    myListState.forEach(movie => {
      myListMap.set(movie.Title, movie);
    });
    
    const processCategory = async (titles: string[]): Promise<MovieDetailsItem[]> => {
      
      const promises = titles.map(async (title) => {

        if (myListMap.has(title)) {
          return myListMap.get(title)!;
        } else {

          try {
            const omdbApiUrl = `${BACKEND_URL}/api/movies/title`;
            const requestBody = { title };
            const response = await axios.post(omdbApiUrl, requestBody);
            const apiData = await response.data.movie;
            return {
              addToWatchedList: null,
              addToWatchLater: null,
              ratingState: "none",
              Type: apiData.Type,
              Title: apiData.Title,
              imdbID: apiData.imdbID,
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
              totalSeasons: apiData.totalSeasons

            };
          } catch (error) {
            console.error(`Error fetching movie ${title}:`, error);
            return null;
          }
        }
      });
      
      const movies = await Promise.all(promises);
      return movies.filter(movie => movie !== null) as MovieDetailsItem[];
    };
    
    const [trending, thriller, comedy, romance] = await Promise.all([
      processCategory(trendingTitles),
      processCategory(thrillerTitles),
      processCategory(comedyTitles),
      processCategory(romanceTitles)
    ]);
    
    return {
      trending,
      thriller,
      comedy,
      romance
    };
  }
);

export const syncFromMyList = createAsyncThunk(
  'movie/syncFromMyList',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const myListState = state.movie.myListState;
    const trendingList = state.movie.trendingListState;
    const thrillerList = state.movie.thrillerListState;
    const comedyList = state.movie.comedyListState;
    const romanceList = state.movie.romanceListState;
    
    const myListMap = new Map<string, MovieDetailsItem>();
    myListState.forEach(movie => {
      myListMap.set(movie.imdbID, movie);
    });

    const syncList = (list: MovieDetailsItem[]): MovieDetailsItem[] => {
      return list.map(movie => {
        const myListMovie = myListMap.get(movie.imdbID);
        if (myListMovie) {
          return {
            ...movie,
            addToWatchedList: myListMovie.addToWatchedList,
            addToWatchLater: myListMovie.addToWatchLater,
            ratingState: myListMovie.ratingState
          };
        }
        return movie;
      });
    };
    
    return {
      trendingList: syncList(trendingList),
      thrillerList: syncList(thrillerList),
      comedyList: syncList(comedyList),
      romanceList: syncList(romanceList)
    };
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
        totalSeasons: apiData.totalSeasons

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
        totalSeasons: apiData.totalSeasons

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
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyListState.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("movieSlice => fetchMyListState.pending => loading: ", state.loading);
      })
      .addCase(fetchMyListState.fulfilled, (state, action) => {
        state.myListState = action.payload;
        state.loading = false;
        state.error = null;
        console.log("movieSlice => fetchMyListState.fulfilled => myListState: ", state.myListState);
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

      .addCase(fetchHomeListStates.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchHomeListStates.fulfilled, (state, action) => {
        state.trendingListState = action.payload.trending;
        state.thrillerListState = action.payload.thriller;
        state.comedyListState = action.payload.comedy;
        state.romanceListState = action.payload.romance;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchHomeListStates.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch movie lists';
        state.loading = false;
      })

      .addCase(syncFromMyList.pending, (state) => {
        state.loading = true;
        console.log("movieSlice => syncFromMyList.pending");
      })
      .addCase(syncFromMyList.fulfilled, (state, action) => {
        state.trendingListState = action.payload.trendingList;
        state.thrillerListState = action.payload.thrillerList;
        state.comedyListState = action.payload.comedyList;
        state.romanceListState = action.payload.romanceList;
        state.loading = false;
        console.log("movieSlice => syncFromMyList.fulfilled");
      })
      .addCase(syncFromMyList.rejected, (state) => {
        state.loading = false;
        console.error("movieSlice => syncFromMyList.rejected");
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
        
        console.log("movieSlice => updateRating.fulfilled => updated movie details: ", movie);
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
        console.log("movieSlice => addToWatchLater.fulfilled => updated movie details: ", movie);
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
        console.log("movieSlice => removeFromWatchedList.fulfilled")
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
        console.log("movieSlice => removeFromWatchLater.fulfilled")
      })
      .addCase(removeFromWatchLater.rejected, (state, action) => {
        state.error =
          action.error.message ||
          "Something went wrong. Please try again later.";
        console.log(
          "movieSlice => removeFromWatchLater.rejected => Failed to remove from watch later list, got error: ",
          state.error
        );
      })
      .addCase(logout, () => {
        return initialState;
      })
  },
});

export const {setLoading} = movieSlice.actions;
export default movieSlice.reducer;
