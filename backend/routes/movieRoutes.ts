import express from "express";
import { 
  fetchMoviesByImdbId, 
  searchMovies, 
  fetchPopularMovies,
  getMovieList,
  addToList,
  removeFromWatchedList,
  removeFromWatchLater,
  updateRating,
  addToWatchLater
} from "../controllers/movieController";

const router = express.Router();

// Search and fetch routes
router.post('/search', searchMovies);
router.post('/popular', fetchPopularMovies);
router.post('/imdbid', fetchMoviesByImdbId);

// Movie list management routes
router.post('/getlist', getMovieList);
router.post('/addtolist', addToList);
router.post('/removefromwatched', removeFromWatchedList);
router.post('/removefromwatchlater', removeFromWatchLater);
router.post('/updaterating', updateRating);
router.post('/addtowatchlater', addToWatchLater);

export default router;