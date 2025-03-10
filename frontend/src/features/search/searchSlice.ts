import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { MovieDetailsItem, SearchApiItem } from "../../types/movieTypes";
import { RootState } from "../../app/store";

const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

interface SearchState {
    searchResults: SearchApiItem[];
    searchState: boolean;
    searchParams: {
        query: string;
        year: string;
        type: string;
      };
      loading: boolean;
      error: string | null;
      page: number;
      totalPages: number;

}

const initialState: SearchState = {
    searchResults: [],
    searchState: false,
    searchParams: {
        query: '',
        year: '',
        type: ''
    },
    loading: false,
    error: null,
    page: 1,
    totalPages: 1
}

export const fetchSearchResults = createAsyncThunk(
    'search.fetchSearchResults',
    async ({query, year, type, page = 1}: {query: string; year: string; type: string; page?: number}, {rejectWithValue}) => {
        try{
            const omdbApiUrl = `${BACKEND_URL}/api/movies/search`;
            const requestBody = {
                query,
                year,
                type,
                page,
            };
            const response = await axios.post(omdbApiUrl, requestBody);
            console.log("searchSlice => fetchSearchResults asyncThunk response: ", response.data)
            return response.data;
        }
        catch(err){
            if(axios.isAxiosError(err)){
                if (err.response?.status === 404){
                    return rejectWithValue('NoMoviesFound');
                }
                else if(err.response?.status === 500){
                    return rejectWithValue('fetchFailed');
                }
            }
            return rejectWithValue('somethingWentWrong')
        }
        
    }
);

export const fetchMovieByImdbId = createAsyncThunk(
  "movie/fetchMovieByImdbId",
  async (imdbID: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const myListState = state.movie.myListState;

    const myMovie = myListState.find((m) => m.imdbID === imdbID);
    if (myMovie) {
      console.log(
        "movieSlice => fetchMovieByImdbId asyncThunk response: ",
        myMovie
      );
      return myMovie;
    }

    try {
      const url = `${BACKEND_URL}/api/movies/imdbid`;
      const requestBody = { imdbID };
      const response = await axios.post(url, requestBody);
      const apiData = response.data.movie;

      return {
        imdbID: imdbID,
        addToWatchedList: null,
        addToWatchLater: null,
        ratingState: "none",
        Type: apiData.Type,

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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          return rejectWithValue("movieNotFound");
        } else if (err.response?.status === 500) {
          return rejectWithValue("fetchFailed");
        }
      }
      return rejectWithValue("somethingWentWrong");
    }
  }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchState: (state, action: PayloadAction<boolean>) => {
            state.searchState = action.payload;
            state.page = 1;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setSearchParams: (state, action: PayloadAction<{query: string; year: string; type: string}>) => {
            state.searchParams = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetSearch: (state) => {
            state.searchState = false;
            state.error = null;
        },
        resetSearchBox: (state) => {
            state.searchParams = {query: '', year: '', type: ''};
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchSearchResults.pending, (state) => {
            state.searchState = true;
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSearchResults.fulfilled, (state, action) => {
            state.searchResults = action.payload.movies;
            state.loading = false;
            state.totalPages = action.payload.totalPages;
            state.error = null;
            state.searchState = true;
        })
        .addCase(fetchSearchResults.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.searchResults = [];
            state.totalPages = 1;
            console.log("searchSlice => fetchSearchResults error: ", state.error);
        })

        .addCase(fetchMovieByImdbId.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMovieByImdbId.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(fetchMovieByImdbId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        
    }
})

export const {setSearchState, setError, setPage, setSearchParams, resetSearch, resetSearchBox} = searchSlice.actions;
export default searchSlice.reducer;

const selectSearchResults = (state: RootState) => state.search.searchResults;
const selectMyList = (state: RootState) => state.movie.myListState;

export const enrichedSearchResults = createSelector(
    [selectSearchResults, selectMyList],
    (searchList: SearchApiItem[], myList: MovieDetailsItem[]) => {
    console.log("myListState: ", myList);

        return searchList.map((searchMovie) => {
            const myMovie = myList.find((m) => m.imdbID === searchMovie.imdbID);
            if(myMovie){
                return {
                    ...searchMovie,
                    ratingState: myMovie.ratingState,
                    addToWatchedList: myMovie.addToWatchedList,
                    addToWatchLater: myMovie.addToWatchLater
                }
            }
            return {
                ...searchMovie,
                addToWatchedList: null,
                addToWatchLater: null,
                ratingState: 'none'
              };
        })
    }
)