import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MovieDetailsItem } from "../../types/movieTypes";

interface FilterState {
    fav_activeType: string;
    fav_activeRating: string;
    loading: boolean;
    error: string | null;
}
  
const initialState: FilterState = {
    fav_activeType: "",
    fav_activeRating: "none",
    loading: false,
    error: null
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFavActiveType: (state, action: PayloadAction<string>) => {
        state.fav_activeType = action.payload;
        state.loading = true;
        state.error = null;
        console.log("filterSlice => setFavActiveType => updated fav_activeType: ", state.fav_activeType);
    },
    setFavActiveRating: (state, action: PayloadAction<string>) => {
        state.fav_activeRating = action.payload;
        state.loading = true;
        state.error = null;
        console.log("filterSlice => setFavActiveRating => updated fav_activeRating: ", state.fav_activeRating);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
        state.loading = false;
    },
    filtersApplied: (state) => {
        state.loading = false;
    }
  },
});

export const {setFavActiveType, setFavActiveRating, setLoading, setError, filtersApplied} = filterSlice.actions;
export default filterSlice.reducer;



const selectMyList = (state: RootState) => state.movie.myListState;
const selectFavActiveType = (state: RootState) => state.filter.fav_activeType;
const selectFavActiveRating = (state: RootState) => state.filter.fav_activeRating;

export const filterFavourites = createSelector(
  [selectMyList, selectFavActiveType, selectFavActiveRating],
  (list: MovieDetailsItem[], activeType: string, activeRating: string) => {
    let filtered = list.filter((movie) => movie.addToWatchedList !== null);
    console.log("list: ", list);
    console.log("filtered: ", filtered);
    if (activeType !== "") {
      filtered = filtered.filter((movie) => movie.Type === activeType);
    }

    if (activeRating !== "none") {
      filtered = filtered.filter((movie) => movie.ratingState === activeRating);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.addToWatchedList || 0).getTime();
      const dateB = new Date(b.addToWatchedList || 0).getTime();
      return dateB - dateA;
    });
    console.log("filterSlice => filterFavourites list: ", filtered);
    return filtered;
  }
);

export const filterWatchLater = createSelector(
    [selectMyList],
    (list: MovieDetailsItem[]) => {
        let filtered = list.filter((movie) => movie.addToWatchLater !== null);

        filtered.sort((a, b) => {
          const dateA = new Date(a.addToWatchLater || 0).getTime();
          const dateB = new Date(b.addToWatchLater || 0).getTime();
          return dateB - dateA;
        });
        console.log("filterSlice => filterWatchLater list: ", filtered);
        return filtered;
    }
)
