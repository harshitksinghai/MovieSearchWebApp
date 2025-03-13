import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import ThemeProviderWrapper from './theme/ThemeProviderWrapper.tsx'
import Footer from './components/Footer.tsx'
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./app/hooks.ts";
import { fetchHomeListStates, fetchMyListState } from "./features/movie/movieSlice.ts";

function App() {

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyListState(userId)).finally(() => {
        dispatch(fetchHomeListStates());
      });
    }
  }, [dispatch, userId]);

  return (

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

  )
}

export default App
