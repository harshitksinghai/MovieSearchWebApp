// In your main.tsx file, replace the existing code with this approach:

import { createRoot } from 'react-dom/client'
import './styles.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App';
import MarketingPage from './pages/MarketingPage.tsx';
import HomePage from './pages/HomePage.tsx';
import FavouritesPage from './pages/FavouritesPage.tsx';
import WatchLaterPage from './pages/WatchLaterPage.tsx';
import MovieDetailsPage from './pages/MovieDetailsPage.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { persistor } from './app/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthProvider } from "react-oidc-context";
import ProtectedRoute from './components/ProtectedRoute.tsx';
import DashboardPage from './pages/DashboardPage.tsx';

const AUTH_COGNITO_AUTHORITY = import.meta.env.VITE_AUTH_COGNITO_AUTHORITY;
const AUTH_COGNITO_CLIENT_ID = import.meta.env.VITE_AUTH_COGNITO_CLIENT_ID;

// Amazon Cognito configuration
const cognitoAuthConfig = {
  authority: AUTH_COGNITO_AUTHORITY,
  client_id: AUTH_COGNITO_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "phone openid email",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    // window.location.href = "/home";
  },
  automaticSilentRenew: true,
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<MarketingPage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path="/movie/:imdbID" element={<MovieDetailsPage />} />
      <Route path='' element={<ProtectedRoute />}>
        <Route path='/mylist' element={<FavouritesPage />} />
        <Route path='/watchlater' element={<WatchLaterPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider {...cognitoAuthConfig}>
        <RouterProvider router={router} />
      </AuthProvider>
    </PersistGate>
  </Provider>
)