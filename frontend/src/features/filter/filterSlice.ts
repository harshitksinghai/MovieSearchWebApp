import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MovieDetailsItem } from "../../types/movieTypes";
import { genreChartShades } from "@/utils/chartColors";
import { GenreChartItem, RatingChartItem } from "@/types/chartDataTypes";
import { ChartConfig } from "@/components/ui/chart";
import { logout } from "../auth/authSlice.ts";

interface FilterState {
  fav_activeType: string;
  fav_activeRating: string;
  loading: boolean;
  error: string | null;
}

const initialState: FilterState = {
  fav_activeType: "",
  fav_activeRating: "none",
  loading: true,
  error: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFavActiveType: (state, action: PayloadAction<string>) => {
      state.fav_activeType = action.payload;
      state.loading = true;
      state.error = null;
      console.log(
        "filterSlice => setFavActiveType => updated fav_activeType: ",
        state.fav_activeType
      );
    },
    setFavActiveRating: (state, action: PayloadAction<string>) => {
      state.fav_activeRating = action.payload;
      state.loading = true;
      state.error = null;
      console.log(
        "filterSlice => setFavActiveRating => updated fav_activeRating: ",
        state.fav_activeRating
      );
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => {
      return initialState;
    });
  },
});

export const {
  setFavActiveType,
  setFavActiveRating,
  setLoading,
  setError,
  filtersApplied,
} = filterSlice.actions;
export default filterSlice.reducer;

const selectMyList = (state: RootState) => state.movie.myListState;
const selectFavActiveType = (state: RootState) => state.filter.fav_activeType;
const selectFavActiveRating = (state: RootState) =>
  state.filter.fav_activeRating;

export const filterFavourites = createSelector(
  [selectMyList, selectFavActiveType, selectFavActiveRating],
  (list: MovieDetailsItem[], activeType: string, activeRating: string) => {
    console.log("myListState: ", list);
    

    let filtered = list.filter((movie) => movie.addToWatchedList !== null);
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
    console.log("myListState: ", list);

    let filtered = list.filter((movie) => movie.addToWatchLater !== null);

    filtered.sort((a, b) => {
      const dateA = new Date(a.addToWatchLater || 0).getTime();
      const dateB = new Date(b.addToWatchLater || 0).getTime();
      return dateB - dateA;
    });
    console.log("filterSlice => filterWatchLater list: ", filtered);
    return filtered;
  }
);

export const totalTimeWatchedFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const totalMoviesMinutes = list
      .filter((item) => item.Type === "movie" && item.addToWatchedList != null)
      .reduce((total, movie) => {
        const runtime = parseInt(movie.Runtime, 10) || 0;
        return total + runtime;
      }, 0);

    const totalSeriesMinutes = list
      .filter((item) => item.Type === "series" && item.addToWatchedList != null)
      .reduce((total, series) => {
        const runtime = parseInt(series.Runtime, 10) || 0;

        const totalSeasons = series.totalSeasons
          ? parseInt(series.totalSeasons, 10) || 0
          : 1;

        return total + runtime * (totalSeasons * 13);
      }, 0);

    const totalMinutes = totalMoviesMinutes + totalSeriesMinutes;

    return {
      totalHours: parseFloat((totalMinutes / 60).toFixed(2)),
      totalMoviesHours: parseFloat((totalMoviesMinutes / 60).toFixed(2)),
      totalSeriesHours: parseFloat((totalSeriesMinutes / 60).toFixed(2)),
    };
  }
);

export const totalLovedTimeWatchedFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const totalLovedMoviesMinutes = list
      .filter(
        (item) =>
          item.Type === "movie" &&
          item.addToWatchedList != null &&
          item.ratingState === "love"
      )
      .reduce((total, movie) => {
        const runtime = parseInt(movie.Runtime, 10) || 0;
        return total + runtime;
      }, 0);

    const totalLovedSeriesMinutes = list
      .filter(
        (item) =>
          item.Type === "series" &&
          item.addToWatchedList != null &&
          item.ratingState === "love"
      )
      .reduce((total, series) => {
        const runtime = parseInt(series.Runtime, 10) || 0;
        const totalSeasons = series.totalSeasons
          ? parseInt(series.totalSeasons) || 0
          : 1;

        return total + runtime * (totalSeasons * 13);
      }, 0);

    const totalLovedMinutes = totalLovedMoviesMinutes + totalLovedSeriesMinutes;

    return {
      totalLovedHours: parseFloat((totalLovedMinutes / 60).toFixed(2)),
      totalLovedMoviesHours: parseFloat(
        (totalLovedMoviesMinutes / 60).toFixed(2)
      ),
      totalLovedSeriesHours: parseFloat(
        (totalLovedSeriesMinutes / 60).toFixed(2)
      ),
    };
  }
);

export const lastThirtyDaysTimeWatchedFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const isWithinLast30Days = (dateString: string | null) => {
      if (!dateString) return false;
      const watchedDate = new Date(dateString);
      return !isNaN(watchedDate.getTime()) && watchedDate >= thirtyDaysAgo;
    };

    const lastThirtyDaysMoviesMinutes = list
      .filter(
        (item) =>
          item.Type === "movie" && isWithinLast30Days(item.addToWatchedList)
      )
      .reduce((total, movie) => {
        const runtime = parseInt(movie.Runtime, 10) || 0;
        return total + runtime;
      }, 0);

    const lastThirtyDaysSeriesMinutes = list
      .filter(
        (item) =>
          item.Type === "series" && isWithinLast30Days(item.addToWatchedList)
      )
      .reduce((total, series) => {
        const runtime = parseInt(series.Runtime, 10) || 0;
        const totalSeasons = series.totalSeasons
          ? parseInt(series.totalSeasons, 10) || 0
          : 1;

        return total + runtime * (totalSeasons * 13);
      }, 0);

    const lastThirtyDaysMinutes =
      lastThirtyDaysMoviesMinutes + lastThirtyDaysSeriesMinutes;

    return {
      lastThirtyDaysHours: parseFloat((lastThirtyDaysMinutes / 60).toFixed(2)),
      lastThirtyDaysMoviesHours: parseFloat(
        (lastThirtyDaysMoviesMinutes / 60).toFixed(2)
      ),
      lastThirtyDaysSeriesHours: parseFloat(
        (lastThirtyDaysSeriesMinutes / 60).toFixed(2)
      ),
    };
  }
);

export const totalWatchedCountFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const totalMoviesWatchedCount = list
      .filter((item) => item.Type === "movie" && item.addToWatchedList != null)
      .reduce((total) => {
        return total + 1;
      }, 0);

    const totalSeriesWatchedCount = list
      .filter((item) => item.Type === "series" && item.addToWatchedList != null)
      .reduce((total) => {
        return total + 1;
      }, 0);

    const totalWatchedCount = totalMoviesWatchedCount + totalSeriesWatchedCount;

    return {
      totalWatchedCount,
      totalMoviesWatchedCount,
      totalSeriesWatchedCount,
    };
  }
);

export const yearlyTimeWatchedFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const currentYear = new Date().getFullYear();

    const monthlyData: Record<string, number> = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    const getMonthName = (dateString: string | null) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.getFullYear() === currentYear
        ? date.toLocaleString("en-US", { month: "long" })
        : null;
    };

    list.forEach((item) => {
      const month = getMonthName(item.addToWatchedList);
      if (!month) return;

      const runtime = parseInt(item.Runtime, 10) || 0;
      let totalTime = runtime;

      if (item.Type === "series") {
        const totalSeasons = item.totalSeasons
          ? parseInt(item.totalSeasons, 10) || 0
          : 1;
        totalTime *= totalSeasons * 13;
      }

      monthlyData[month] += totalTime / 60;
    });

    // Convert to array format with float values
    return Object.entries(monthlyData).map(([month, time]) => ({
      month,
      time: parseFloat(time.toFixed(2)),
    }));
  }
);

export const genreChartDataFilter = createSelector(
  [selectMyList], // Adjust this path to match your Redux store structure
  (
    list: MovieDetailsItem[]
  ): { genreChartData: GenreChartItem[]; genreChartConfig: ChartConfig } => {
    // Count genres
    const genreCounts: Record<string, number> = {};

    // Process each movie's genres
    list.forEach((movie) => {
      if (movie.Genre) {
        // Split the genre string by commas and trim whitespace
        const genres = movie.Genre.split(",").map((genre) => genre.trim());

        // Increment count for each genre
        genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Convert to array and sort by count (descending)
    const sortedGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    // Take top 4 genres and group the rest as "Other"
    const topGenres = sortedGenres.slice(0, 4);
    const otherGenresCount = sortedGenres
      .slice(4)
      .reduce((sum, item) => sum + item.count, 0);

    // Create chart data structure with color based on count ranking
    const genreChartData: GenreChartItem[] = topGenres.map((item) => ({
      genre: item.genre.toLowerCase(),
      count: item.count,
      fill: `var(--color-${item.genre.toLowerCase()})`,
    }));

    // Add "Other" category if we have more than 4 genres
    if (otherGenresCount > 0) {
      genreChartData.push({
        genre: "other",
        count: otherGenresCount,
        fill: "var(--color-other)",
      });
    }

    // Create chart config dynamically based on count ranking
    const genreChartConfig: ChartConfig = {
      count: {
        label: "Count",
      },
    };

    // Add entries for each genre with colors based on count ranking
    [
      ...topGenres.map((item, index) => ({
        genre: item.genre,
        count: item.count,
        shadeIndex: index, // Assign shade index based on count ranking
      })),
      {
        genre: "Other",
        count: otherGenresCount,
        shadeIndex: 4, // "Other" always gets the lightest shade (index 4)
      },
    ].forEach((item) => {
      if (item.count > 0) {
        const genreKey = item.genre.toLowerCase();
        genreChartConfig[genreKey] = {
          label: item.genre,
          color: genreChartShades[item.shadeIndex], // Use shade based on count ranking
        };
      }
    });

    // Update the fill property in genreChartData to use the same shade logic
    genreChartData.forEach((item) => {
      const genreKey = item.genre;
      item.fill = `var(--color-${genreKey})`;
    });

    return { genreChartData, genreChartConfig };
  }
);

export const ratingChartDataFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]): RatingChartItem[] => {
    // Initialize an empty object to store all ratings dynamically
    const ratingCounts: Record<string, number> = {
      Love: 0,
      Like: 0,
      Dislike: 0,
    };

    // Count occurrences of each rating
    list.forEach((movie) => {
      // Check if the movie has a valid rating
      if (movie.ratingState === "love") {
        // Increment the corresponding rating counter
        ratingCounts["Love"]++;
      } else if (movie.ratingState === "like") {
        ratingCounts["Like"]++;
      } else if (movie.ratingState === "dislike") {
        ratingCounts["Dislike"]++;
      }
    });

    // Convert to array format required by the chart
    const ratingChartData: RatingChartItem[] = Object.entries(ratingCounts)
      .map(([rating, count]) => ({ rating, count }))
      // Optional: Sort by count (descending)
      .sort((a, b) => b.count - a.count);

    return ratingChartData;
  }
);

export const recentFavouritesFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const recentFavourites = list
      .filter((item) => item.addToWatchedList != null)
      .sort(
        (a, b) =>
          new Date(b.addToWatchedList!).getTime() -
          new Date(a.addToWatchedList!).getTime()
      )
      .slice(0, 6)
      .map((item) => ({
        imdbID: item.imdbID,
        Title: item.Title,
        Type: item.Type,
        year: item.Year,
      }));

    return recentFavourites;
  }
);

export const reWatchesFilter = createSelector(
  [selectMyList],
  (list: MovieDetailsItem[]) => {
    const reWatches = list
      .filter(
        (item) => item.addToWatchedList != null && item.addToWatchLater != null
      )
      .sort(
        (a, b) =>
          new Date(b.addToWatchedList!).getTime() -
          new Date(a.addToWatchedList!).getTime()
      )
      .map((item) => ({
        imdbID: item.imdbID,
        Title: item.Title,
        Type: item.Type,
        year: item.Year,
      }));

    return {
      totalReWatches: reWatches.length,
      reWatches: reWatches.slice(0, 4),
    };
  }
);
