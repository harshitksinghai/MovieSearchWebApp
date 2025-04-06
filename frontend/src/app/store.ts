import { combineSlices, configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/auth/authSlice'
import movieReducer from '../redux/movie/movieSlice';
import filterReducer from '../redux/filter/filterSlice';
import searchReducer from '../redux/search/searchSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['userId']
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineSlices({
    auth: persistedAuthReducer,
    movie: movieReducer,
    filter: filterReducer,
    search: searchReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
          });
    }
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
