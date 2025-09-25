// // In your main.tsx file, replace the existing code with this approach:

// import { createRoot } from 'react-dom/client'
// import './styles.css'
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
// import App from './App.tsx';
// import MarketingPage from './services/marketing-service/pages/MarketingPage.tsx';
// import HomePage from './services/movie-service/pages/HomePage.tsx';
// import FavouritesPage from './services/user-service/favourites/pages/FavouritesPage.tsx';
// import WatchLaterPage from './services/user-service/watch-later/pages/WatchLaterPage.tsx';
// import MovieDetailsPage from './services/movie-service/pages/MovieDetailsPage.tsx';
// import { Provider } from 'react-redux';
// import { store } from './app/store.ts';
// import { persistor } from './app/store.ts';
// import { PersistGate } from 'redux-persist/integration/react';
// import { AuthProvider } from "react-oidc-context";
// import ProtectedRoute from './services/auth-service/components/ProtectedRoute.tsx';
// import DashboardPage from './services/user-service/dashboard/pages/DashboardPage.tsx';
// import { WebStorageStateStore } from 'oidc-client-ts';
// import AuthPage from './services/auth-service/pages/AuthPage.tsx';

// const AUTH_COGNITO_AUTHORITY = import.meta.env.VITE_AUTH_COGNITO_AUTHORITY;
// const AUTH_COGNITO_CLIENT_ID = import.meta.env.VITE_AUTH_COGNITO_CLIENT_ID;

// // Amazon Cognito configuration
// const cognitoAuthConfig = {
//   authority: AUTH_COGNITO_AUTHORITY,
//   client_id: AUTH_COGNITO_CLIENT_ID,
//   redirect_uri: window.location.origin,
//   response_type: "code",
//   scope: "phone openid email",
//   userStore: new WebStorageStateStore({ store: window.localStorage }),
//   onSigninCallback: () => {
//     window.history.replaceState({}, document.title, window.location.pathname);
//     // window.location.href = "/home";
//   },
//   automaticSilentRenew: true,
// };

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route index={true} path="/" element={<MarketingPage />} />
//       <Route path='/register' element={<AuthPage mode="register" />} />
//       <Route path='/login' element={<AuthPage mode="login" />} />
//       <Route path='/home' element={<HomePage />} />
//       <Route path="/movie/:imdbID" element={<MovieDetailsPage />} />
//       <Route path='' element={<ProtectedRoute />}>
//         <Route path='/mylist' element={<FavouritesPage />} />
//         <Route path='/watchlater' element={<WatchLaterPage />} />
//         <Route path='/dashboard' element={<DashboardPage />} />
//       </Route>
//     </Route>
//   )
// );

// createRoot(document.getElementById('root')!).render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <AuthProvider {...cognitoAuthConfig}>
//         <RouterProvider router={router} />
//       </AuthProvider>
//     </PersistGate>
//   </Provider>
// )