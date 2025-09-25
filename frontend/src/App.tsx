import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import { CustomThemeProvider } from '../src/context/CustomThemeProvider.tsx'
import Footer from './components/Footer.tsx'
import { useEffect } from "react";
import { useAppDispatch } from "./app/reduxHooks.ts";
import { fetchHomeListStates, fetchMyListState } from "./redux/movie/movieSlice.ts";
import { fetchOrAddUser, fetchUserCountry } from './redux/auth/authSlice.ts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { useCustomAuth } from './services/auth-service/hooks/useCustomAuth.tsx';

function App() {
  const { userId, loading } = useCustomAuth()
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserCountry());
  }, [])

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrAddUser(userId));
      dispatch(fetchMyListState(userId));
      dispatch(fetchHomeListStates());
    }
    else {
      dispatch(fetchHomeListStates());
    }
  }, [userId, dispatch]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {t('loading...')}
        </Typography>
      </Box>
    );
  }

  return (
    <CustomThemeProvider>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <main style={{ flex: '1 0 auto' }}>
          <Outlet />
        </main>
        <Toaster richColors position='bottom-right' />
        <Footer />
      </div>
    </CustomThemeProvider>
  )
}

export default App