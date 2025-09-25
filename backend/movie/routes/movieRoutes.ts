import express from "express";
import { 
  fetchMovieByImdbId, 
  searchMovies, 
  removeFromWatchedList,
  removeFromWatchLater,
  updateRating,
  addToWatchLater,
  fetchMovieByTitle,
  getMovieListWithDetails
} from "../controllers/movieController";
import { actionButtonLimiter, searchRateLimiter } from "../../middlewares/rateLimiter";
import { verifyToken } from "../../middlewares/authToken";
import { decryptRequest } from "../../middlewares/dataInTransitEncryption";
import { encryptResponseForRoute } from "../../middlewares/encryptResponseForRoute";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieDetails:
 *       type: object
 *       properties:
 *         Title:
 *           type: string
 *           description: The title of the movie or TV series
 *         Year:
 *           type: string
 *           description: The release year or range of the TV series
 *         Rated:
 *           type: string
 *           description: The movie's age rating
 *         Released:
 *           type: string
 *           format: date
 *           description: The release date of the movie or TV show
 *         Runtime:
 *           type: string
 *           description: The duration of the movie or episode
 *         Genre:
 *           type: string
 *           description: The genres associated with the movie
 *         Director:
 *           type: string
 *           description: The director of the movie (or "N/A" for TV series)
 *         Writer:
 *           type: string
 *           description: The writer(s) of the movie or TV series
 *         Actors:
 *           type: string
 *           description: The main actors in the movie or TV series
 *         Plot:
 *           type: string
 *           description: A brief summary of the movie's plot
 *         Language:
 *           type: string
 *           description: The languages spoken in the movie
 *         Country:
 *           type: string
 *           description: The country where the movie or series was produced
 *         Awards:
 *           type: string
 *           description: Awards won by the movie or TV series
 *         Poster:
 *           type: string
 *           format: uri
 *           description: URL of the movie poster image
 *         Ratings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               Source:
 *                 type: string
 *                 description: The rating source (e.g., IMDb, Rotten Tomatoes)
 *               Value:
 *                 type: string
 *                 description: The rating value from the respective source
 *         Metascore:
 *           type: string
 *           description: The Metascore rating for the movie
 *         imdbRating:
 *           type: string
 *           description: IMDb rating of the movie
 *         imdbVotes:
 *           type: string
 *           description: Total number of IMDb votes
 *         imdbID:
 *           type: string
 *           description: IMDb ID of the movie or series
 *         Type:
 *           type: string
 *           description: The type of content (e.g., "movie" or "series")
 *         totalSeasons:
 *           type: string
 *           description: The total number of seasons (if applicable)
 *         Response:
 *           type: string
 *           enum: ["True", "False"]
 *           description: Indicates if the API response was successful
 *       example:
 *         Title: "Dexter"
 *         Year: "2006–2013"
 *         Rated: "TV-MA"
 *         Released: "2006-10-01"
 *         Runtime: "53 min"
 *         Genre: "Crime, Drama, Mystery"
 *         Director: "N/A"
 *         Writer: "James Manos Jr."
 *         Actors: "Michael C. Hall, Jennifer Carpenter, David Zayas"
 *         Plot: "He's smart, he's good looking, and he's got a great sense of humor..."
 *         Language: "English, Spanish"
 *         Country: "United States"
 *         Awards: "Won 4 Primetime Emmys. 56 wins & 202 nominations total"
 *         Poster: "https://m.media-amazon.com/images/M/MV5BMTQ3YmQ4YzMtOTkyZC00YmM5LThhZjEtM2E0MjFkNTc0OGJhXkEyXkFqcGc@._V1_SX300.jpg"
 *         Ratings:
 *           - Source: "Internet Movie Database"
 *             Value: "8.6/10"
 *         Metascore: "N/A"
 *         imdbRating: "8.6"
 *         imdbVotes: "820,869"
 *         imdbID: "tt0773262"
 *         Type: "series"
 *         totalSeasons: "8"
 *         Response: "True"
 *     
 *     MovieList:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the movie entry in the database
 *         imdbID:
 *           type: string
 *           description: The IMDb ID of the movie
 *         addToWatchedList:
 *           type: string
 *           nullable: true
 *           description: Indicates if the movie is added to the watched list
 *         addToWatchLater:
 *           type: string
 *           nullable: true
 *           description: Indicates if the movie is added to the watch later list
 *         ratingState:
 *           type: string
 *           nullable: true
 *           description: User rating for the movie
 *         Type:
 *           type: string
 *           description: The type of content (movie, series, etc.)
 *         userId:
 *           type: string
 *           description: The user ID associated with this movie entry
 *       example:
 *         id: 1
 *         imdbID: "tt1375666"
 *         addToWatchedList: "yes"
 *         addToWatchLater: "no"
 *         ratingState: "5 stars"
 *         Type: "movie"
 *         userId: "hashedUserId123"
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API for retrieving and managing movie details
 */


// Search and fetch routes

/**
 * @swagger
 *  /api/movies/search:
 *   post:
 *     summary: Search for movies
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: The search query for movie titles
 *               year:
 *                 type: string
 *                 description: The release year of the movie (optional)
 *               type:
 *                 type: string
 *                 description: The type of result (movie, series, episode) (optional)
 *               page:
 *                 type: integer
 *                 description: Page number for paginated results (default is 1)
 *     responses:
 *       200:
 *         description: Successfully retrieved movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Title:
 *                         type: string
 *                         example: "Inception"
 *                       Year:
 *                         type: string
 *                         example: "2010"
 *                       imdbID:
 *                         type: string
 *                         example: "tt1375666"
 *                       Type:
 *                         type: string
 *                         example: "movie"
 *                       Poster:
 *                         type: string
 *                         example: "https://example.com/poster.jpg"
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Missing search query in request body
 *       404:
 *         description: No movies found
 *       500:
 *         description: Internal server error
 */
router.post('/search', searchRateLimiter, searchMovies);

/**
 * @swagger
 *  /api/movies/imdbid:
 *   post:
 *     summary: Fetch movie details by IMDb ID
 *     description: Retrieves detailed information about a movie using its IMDb ID.
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imdbID:
 *                 type: string
 *                 description: The IMDb ID of the movie
 *             required:
 *               - imdbID
 *             example:
 *               imdbID: "tt0773262"
 *     responses:
 *       200:
 *         description: Successfully retrieved movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   $ref: "#/components/schemas/MovieDetails"
 *       400:
 *         description: IMDb ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "IMDB ID is required"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Movie not found"
 *       500:
 *         description: Internal server error (Failed to fetch movie details)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch movie details"
 */
router.post('/imdbid', fetchMovieByImdbId);

/**
 * @swagger
 *  /api/movies/title:
 *   post:
 *     summary: Fetch movie details by title
 *     description: Retrieves detailed information about a movie using its title.
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the movie
 *             required:
 *               - title
 *             example:
 *               title: "Dexter"
 *     responses:
 *       200:
 *         description: Successfully retrieved movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   $ref: "#/components/schemas/MovieDetails"
 *       400:
 *         description: Title is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Title is required"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Movie not found"
 *       500:
 *         description: Internal server error (Failed to fetch movie details)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch movie details"
 */
router.post('/title', fetchMovieByTitle);

// Movie list management routes

router.post('/getlistwithdetails', verifyToken, decryptRequest, encryptResponseForRoute, getMovieListWithDetails);

/**
 * @swagger
 *  /api/movies/removefromwatched:
 *   post:
 *     summary: Remove a movie from the watched list
 *     description: Removes a movie from the user's watched list. If the movie is not in the watch later list, it is deleted; otherwise, only the watched status is updated.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imdbID:
 *                 type: string
 *                 description: IMDb ID of the movie
 *                 example: "tt0773262"
 *               userId:
 *                 type: string
 *                 description: Unique user identifier
 *                 example: "user12345"
 *             required:
 *               - imdbID
 *               - userId
 *     responses:
 *       200:
 *         description: Successfully removed the movie from the watched list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie removed from watched list"
 *       400:
 *         description: Missing required parameters (imdbID or userId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "IMDB ID is required"
 *       404:
 *         description: Movie not found in the user's list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Movie not found in your list"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/removefromwatched', verifyToken, actionButtonLimiter, decryptRequest, encryptResponseForRoute, removeFromWatchedList);

/**
 * @swagger
 *  /api/movies/removefromwatchlater:
 *   post:
 *     summary: Remove a movie from the watch later list
 *     description: Removes a movie from the user's watch later list. If the movie is not in the watched list, it is deleted; otherwise, only the watch later status is updated.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imdbID:
 *                 type: string
 *                 description: IMDb ID of the movie
 *                 example: "tt1234567"
 *               userId:
 *                 type: string
 *                 description: Unique user identifier
 *                 example: "user12345"
 *             required:
 *               - imdbID
 *               - userId
 *     responses:
 *       200:
 *         description: Successfully removed the movie from the watch later list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie removed from watch later list"
 *       400:
 *         description: Missing required parameters (imdbID or userId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "IMDB ID is required"
 *       404:
 *         description: Movie not found in the user's list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Movie not found in your list"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/removefromwatchlater', verifyToken, actionButtonLimiter, decryptRequest, encryptResponseForRoute, removeFromWatchLater);

/**
 * @swagger
 *  /api/movies/updaterating:
 *   post:
 *     summary: Update or add a movie rating
 *     description: Updates the rating of a movie for a user. If the movie does not exist in the list, it is added automatically.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imdbID:
 *                 type: string
 *                 description: IMDb ID of the movie
 *                 example: "tt1234567"
 *               ratingState:
 *                 type: number
 *                 description: Rating given by the user (e.g., 1-10)
 *                 example: 8
 *               Type:
 *                 type: string
 *                 description: Type of media (e.g., movie, series)
 *                 example: "movie"
 *               userId:
 *                 type: string
 *                 description: Unique user identifier
 *                 example: "user12345"
 *             required:
 *               - imdbID
 *               - ratingState
 *               - Type
 *               - userId
 *     responses:
 *       200:
 *         description: Successfully updated or added the rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: object
 *                   properties:
 *                     imdbID:
 *                       type: string
 *                       example: "tt1234567"
 *                     addToWatchedList:
 *                       type: string
 *                       example: "2025-03-27T12:00:00.000Z"
 *                     addToWatchLater:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     ratingState:
 *                       type: number
 *                       example: 8
 *                     Type:
 *                       type: string
 *                       example: "movie"
 *       400:
 *         description: Missing required parameters (imdbID or userId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "IMDB ID is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/updaterating', verifyToken, actionButtonLimiter, decryptRequest, encryptResponseForRoute, updateRating);

/**
 * @swagger
 *  /api/movies/addtowatchlater:
 *   post:
 *     summary: Add a movie to the "Watch Later" list
 *     description: Adds a movie to the user's "Watch Later" list. If the movie does not exist in the user's list, it is inserted.
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imdbID:
 *                 type: string
 *                 description: IMDb ID of the movie
 *                 example: "tt1234567"
 *               ratingState:
 *                 type: number
 *                 description: User's rating for the movie (optional)
 *                 example: 7
 *               Type:
 *                 type: string
 *                 description: Type of media (e.g., movie, series)
 *                 example: "movie"
 *               userId:
 *                 type: string
 *                 description: Unique user identifier
 *                 example: "user12345"
 *             required:
 *               - imdbID
 *               - Type
 *               - userId
 *     responses:
 *       200:
 *         description: Successfully added or updated the "Watch Later" status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 movie:
 *                   type: object
 *                   properties:
 *                     imdbID:
 *                       type: string
 *                       example: "tt1234567"
 *                     addToWatchedList:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     addToWatchLater:
 *                       type: string
 *                       example: "2025-03-27T12:00:00.000Z"
 *                     ratingState:
 *                       type: number
 *                       nullable: true
 *                       example: 7
 *                     Type:
 *                       type: string
 *                       example: "movie"
 *       400:
 *         description: Missing required parameters (imdbID or userId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "IMDB ID is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/addtowatchlater', verifyToken, actionButtonLimiter, decryptRequest, encryptResponseForRoute, addToWatchLater);

export default router;
