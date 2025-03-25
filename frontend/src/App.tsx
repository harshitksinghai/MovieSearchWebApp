import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import { CustomThemeProvider } from '../src/context/CustomThemeProvider.tsx'
import Footer from './components/Footer.tsx'
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useAppDispatch, useAppSelector } from "./app/hooks.ts";
import { fetchHomeListStates, fetchMyListState } from "./features/movie/movieSlice.ts";
import { addUserIdInDB, fetchCurrentUserDetails } from './features/auth/authSlice.ts';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function App() {
  const auth = useAuth();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    // Set user ID when authenticated
    if (auth.isAuthenticated && auth.user?.profile.email) {
      dispatch(addUserIdInDB(auth.user.profile.email))
        .unwrap()
        .then(() => {
          if(auth.user?.profile.email){
            dispatch(fetchCurrentUserDetails(auth.user.profile.email));
          }
      })
    }
  }, [auth.isAuthenticated, auth.user, dispatch]);
  
  useEffect(() => {
    
      dispatch(fetchMyListState(userId)).finally(() => {
        dispatch(fetchHomeListStates());
      });
    
  }, [dispatch, userId]);

  if (auth.isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {t('loading...')}
        </Typography>
      </Box>
    );
  }

  if (auth.error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{t('authError')} {auth.error.message}</Alert>
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
        <Footer />
      </div>
      </CustomThemeProvider>
  )
}

export default App