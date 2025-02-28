import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App';
import MarketingPage from './pages/MarketingPage.tsx';
import HomePage from './pages/HomePage.tsx';
import FavouritesPage from './pages/FavouritesPage.tsx';
import WatchLaterPage from './pages/WatchLaterPage.tsx';
import MovieDetailsPage from './pages/MovieDetailsPage.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<MarketingPage />} />
      <Route index={true} path='/home' element={<HomePage />} />
      <Route index={true} path='/mylist' element={<FavouritesPage />} />
      <Route index={true} path='/WatchLater' element={<WatchLaterPage />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
