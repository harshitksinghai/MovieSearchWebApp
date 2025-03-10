import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import ThemeProviderWrapper from './theme/ThemeProviderWrapper.tsx'
import Footer from './components/Footer.tsx'
import { persistor } from './app/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks.ts";
import { fetchMyListState } from "./features/movie/movieSlice.ts";

function App() {

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyListState(userId));
    }
  }, [dispatch, userId]);

  return (
    
      <PersistGate loading={null} persistor={persistor}>
            <ThemeProviderWrapper>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
              }}>
                <main style={{ flex: '1 0 auto' }}>
                  <Outlet />
                </main>
                <Footer />
              </div>
            </ThemeProviderWrapper>
      </PersistGate>
  )
}

export default App
