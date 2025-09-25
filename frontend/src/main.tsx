import { createRoot } from 'react-dom/client'
import './styles.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App';
import MarketingPage from './services/marketing-service/pages/MarketingPage.tsx';
import HomePage from './services/movie-service/pages/HomePage.tsx';
import FavouritesPage from './services/user-service/favourites/pages/FavouritesPage.tsx';
import WatchLaterPage from './services/user-service/watch-later/pages/WatchLaterPage.tsx';
import MovieDetailsPage from './services/movie-service/pages/MovieDetailsPage.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import ProtectedRoute from './services/auth-service/components/ProtectedRoute.tsx';
import DashboardPage from './services/user-service/dashboard/pages/DashboardPage.tsx';
import AuthPage from './services/auth-service/pages/AuthPage.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<MarketingPage />} />
      <Route path='/register' element={<AuthPage mode="register" />} />
      <Route path='/login' element={<AuthPage mode="login" />} />
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
r
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
        <RouterProvider router={router} />
  </Provider>
)