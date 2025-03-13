import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import ThemeProviderWrapper from './theme/ThemeProviderWrapper.tsx'
import Footer from './components/Footer.tsx'
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useAppDispatch, useAppSelector } from "./app/hooks.ts";
import { fetchHomeListStates, fetchMyListState } from "./features/movie/movieSlice.ts";

function App() {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyListState(userId)).finally(() => {
        dispatch(fetchHomeListStates());
      });
    }
  }, [dispatch, userId]);

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Authentication error: {auth.error.message}</div>;
  }

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