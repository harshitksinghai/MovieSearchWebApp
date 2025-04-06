import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import { CustomThemeProvider } from '../src/context/CustomThemeProvider.tsx'
import Footer from './components/Footer.tsx'
import { useEffect, useState } from "react";
import { useAuth, hasAuthParams } from "react-oidc-context";
import { useAppDispatch } from "./app/hooks.ts";
import { fetchHomeListStates, fetchMyListState } from "./features/movie/movieSlice.ts";
import { fetchOrAddUser, fetchUserCountry } from './features/auth/authSlice.ts';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

const AUTH_COGNITO_CLIENT_ID = import.meta.env.VITE_AUTH_COGNITO_CLIENT_ID;
const AUTH_COGNITO_AUTHORITY = import.meta.env.VITE_AUTH_COGNITO_AUTHORITY;

function App() {
  const auth = useAuth();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  useEffect(() => {
    dispatch(fetchUserCountry());
  }, [])
  
  useEffect(() => {
    const storageKey = `oidc.user:${AUTH_COGNITO_AUTHORITY}:${AUTH_COGNITO_CLIENT_ID}`;
    const storedUser = localStorage.getItem(storageKey);

    if (!hasAuthParams() &&
        !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
        !hasTriedSignin && storedUser
    ) {
      console.log("auto signin")
      auth.signinRedirect();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  useEffect(() => {
    console.log("auth.isLoading: ", auth.isLoading );
    if (auth.isLoading) return;
    if (auth.isAuthenticated && auth.user?.profile.email) {
      dispatch(fetchOrAddUser(auth.user.profile.email));
      dispatch(fetchMyListState(auth.user.profile.email));
      dispatch(fetchHomeListStates());
    }
    else{
      dispatch(fetchHomeListStates());
    }
  }, [auth.isAuthenticated, auth.user, dispatch]);

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
        <Toaster richColors position='bottom-right' />
        <Footer />
      </div>
      </CustomThemeProvider>
  )
}

export default App