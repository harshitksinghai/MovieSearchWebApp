import { combineSlices, configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/auth/authSlice'
import movieReducer from '../redux/movie/movieSlice';
import filterReducer from '../redux/filter/filterSlice';
import searchReducer from '../redux/search/searchSlice';

const rootReducer = combineSlices({
    auth: authReducer,
    movie: movieReducer,
    filter: filterReducer,
    search: searchReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware();
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
