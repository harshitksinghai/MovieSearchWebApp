import asyncHandler from "express-async-handler";
import axios from "axios";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import pool from "../config/db";

dotenv.config();
const MODE = process.env.MODE;
const API_KEY = process.env.OMDB_API_KEY;
const API_URL = MODE === "production"
? process.env.OMDB_API_URL_PROD
: process.env.OMDB_API_URL_DEV;

export interface MovieItem {
  imdbID: string;
  addToWatchedList: string; // ISO date string
  addToWatchLater: string; // ISO date string
  ratingState: "none" | "dislike" | "like" | "love";
  Type: "none" | "movie" | "series" | "game";
}

// Define interfaces for OMDB API responses
interface OmdbSearchResponse {
  Search: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }[];
  totalResults: string;
  Response: string;
}

interface OmdbDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}

const POPULAR_MOVIES = [
  "Avatar", "Inception", "Interstellar", "The Dark Knight",
  "Spider-Man", "Iron Man", "Black Panther", "Wonder Woman"
];

const POPULAR_SERIES = [
  "Breaking Bad", "Game of Thrones", "Stranger Things", "The Crown",
  "The Mandalorian", "Friends", "The Office", "Better Call Saul"
];

export const searchMovies = asyncHandler(async (req: Request, res: Response) => {
  const { query, year, type, page = 1 } = req.body;

  if (!query) {
    res.status(400).json({
      success: false,
      error: "Search query is required"
    });
    return;
  }

  try {
    let url = `${API_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
    if (year) url += `&y=${encodeURIComponent(year)}`;
    if (type) url += `&type=${encodeURIComponent(type)}`;

    console.log('Backend Request URL:', url);
    const response = await axios.get<OmdbSearchResponse>(url);

    if (response.data.Response === "True") {
      res.json({
        success: true,
        movies: response.data.Search,
        totalPages: Math.ceil(Number(response.data.totalResults) / 10),
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No movies found"
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch movies"
    });
  }
});

export const fetchPopularMovies = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.body;
  
  try {
    const titles = type === "series" ? POPULAR_SERIES : POPULAR_MOVIES;
    
    const promises = titles.map(title => 
      axios.get<OmdbDetailResponse>(`${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}${type ? `&type=${type}` : ''}`)
    );
    
    const results = await Promise.all(promises);
    
    const validResults = results
      .map(response => response.data)
      .filter(data => data.Response === "True");
    
    res.json({
      success: true,
      movies: validResults
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular movies"
    });
  }
});

export const fetchMoviesByImdbId = asyncHandler(async (req: Request, res: Response) => {
  const { imdbID } = req.body;
  
  if (!imdbID) {
    res.status(400).json({
      success: false,
      error: "IMDB ID is required"
    });
    return;
  }
  
  try {
    const url = `${API_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
    
    console.log('Backend IMDB ID Request URL:', url);
    const response = await axios.get<OmdbDetailResponse>(url);
    
    if (response.data.Response === "True") {
      res.json({
        success: true,
        movie: response.data
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Movie not found"
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch movie details"
    });
  }
});

export const getMovieList = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.body);
  const userId = req.body.userId as string;
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: "User ID is required"
    });
    return;
  }
  
  try {
    const result = await pool.query(
      'SELECT "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type" FROM "movieList_YN100" WHERE "userId" = $1',
      [userId]
    );
    res.json({
      success: true,
      movieList: result.rows
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export const addToList = asyncHandler(async (req: Request, res: Response) => {
  const { imdbID, ratingState, Type, isAddToWatchedList, isAddToWatchLater, userId } = req.body;
  
  if (!imdbID) {
    res.status(400).json({
      success: false,
      error: "IMDB ID is required"
    });
    return;
  }
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: "User ID is required"
    });
    return;
  }
  
  try {
    // First ensure the user exists in the users table
    await pool.query(
      'INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING',
      [userId]
    );
    
    const watchedDate = isAddToWatchedList ? new Date().toISOString() : '';
    const watchLaterDate = isAddToWatchLater ? new Date().toISOString() : '';
    
    const query = `
      INSERT INTO "movieList_YN100" ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("userId", "imdbID") 
      DO UPDATE SET 
        "addToWatchedList" = $2,
        "addToWatchLater" = $3,
        "ratingState" = $4,
        "Type" = $5
      RETURNING *
    `;
    
    const result = await pool.query(query, [imdbID, watchedDate, watchLaterDate, ratingState, Type, userId]);
    
    res.json({
      success: true,
      movie: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding to list:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export const removeFromWatchedList = asyncHandler(async (req: Request, res: Response) => {
  const { imdbID, userId } = req.body;
  
  if (!imdbID) {
    res.status(400).json({
      success: false,
      error: "IMDB ID is required"
    });
    return;
  }
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: "User ID is required"
    });
    return;
  }
  
  try {
    // First check if this movie exists in the database for this user
    const checkResult = await pool.query(
      'SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', 
      [imdbID, userId]
    );
    
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Movie not found in your list"
      });
      return;
    }
    
    const movie = checkResult.rows[0];
    
    // If watchLater is empty, remove the movie completely
    if (!movie.addToWatchLater) {
      await pool.query(
        'DELETE FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', 
        [imdbID, userId]
      );
    } else {
      // Otherwise just update the watched status
      await pool.query(
        'UPDATE "movieList_YN100" SET "addToWatchedList" = $1, "ratingState" = $2 WHERE "imdbID" = $3 AND "userId" = $4',
        ['', 'none', imdbID, userId]
      );
    }
    
    res.json({
      success: true,
      message: "Movie removed from watched list"
    });
  } catch (error) {
    console.error('Error removing from watched list:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export const removeFromWatchLater = asyncHandler(async (req: Request, res: Response) => {
  const { imdbID, userId } = req.body;
  
  if (!imdbID) {
    res.status(400).json({
      success: false,
      error: "IMDB ID is required"
    });
    return;
  }
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: "User ID is required"
    });
    return;
  }
  
  try {
    // First check if this movie exists in the database for this user
    const checkResult = await pool.query(
      'SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', 
      [imdbID, userId]
    );
    
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Movie not found in your list"
      });
      return;
    }
    
    const movie = checkResult.rows[0];
    
    // If watchedList is empty, remove the movie completely
    if (!movie.addToWatchedList) {
      await pool.query(
        'DELETE FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', 
        [imdbID, userId]
      );
    } else {
      // Otherwise just update the watchLater status
      await pool.query(
        'UPDATE "movieList_YN100" SET "addToWatchLater" = $1 WHERE "imdbID" = $2 AND "userId" = $3',
        ['', imdbID, userId]
      );
    }
    
    res.json({
      success: true,
      message: "Movie removed from watch later list"
    });
  } catch (error) {
    console.error('Error removing from watch later list:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export const updateRating = asyncHandler(async (req: Request, res: Response) => {
  const { imdbID, ratingState, Type, userId } = req.body;
  
  if (!imdbID) {
    res.status(400).json({
      success: false,
      error: "IMDB ID is required"
    });
    return;
  }
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: "User ID is required"
    });
    return;
  }
  
  try {
    // Ensure user exists
    await pool.query(
      'INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING',
      [userId]
    );
    
    // Check if the movie exists in the database
    const checkResult = await pool.query(
      'SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', 
      [imdbID, userId]
    );
    
    if (checkResult.rows.length === 0) {
      // Movie doesn't exist, add it
      const query = `
        INSERT INTO "movieList_YN100" ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        imdbID,
        new Date().toISOString(),  // Add to watched list
        '',                         // Not in watch later
        ratingState,
        Type,
        userId
      ]);
      
      res.json({
        success: true,
        movie: result.rows[0]
      });
    } else {
      // Movie exists, update it
      const query = `
        UPDATE "movieList_YN100" 
        SET "ratingState" = $1, 
            "addToWatchedList" = COALESCE(NULLIF("addToWatchedList", ''), $2),
            "addToWatchLater" = ''
        WHERE "imdbID" = $3 AND "userId" = $4
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        ratingState,
        new Date().toISOString(),
        imdbID,
        userId
      ]);
      
      res.json({
        success: true,
        movie: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

export const addToWatchLater = asyncHandler(async (req: Request, res: Response) => {
  const { imdbID, ratingState, Type, userId } = req.body;
  
  if (!imdbID) {
    res.status(400).json({
      success: false,
      error: "IMDB ID is required"
    });
    return;
  }
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: "User ID is required"
    });
    return;
  }
  
  try {
    // Ensure user exists
    await pool.query(
      'INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING',
      [userId]
    );
    
    // Check if the movie exists in the database
    const checkResult = await pool.query(
      'SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', 
      [imdbID, userId]
    );
    
    if (checkResult.rows.length === 0) {
      // Movie doesn't exist, add it
      const query = `
        INSERT INTO "movieList_YN100" ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        imdbID,
        '',                        // Not in watched list
        new Date().toISOString(),  // Add to watch later
        ratingState,
        Type,
        userId
      ]);
      
      res.json({
        success: true,
        movie: result.rows[0]
      });
    } else {
      // Movie exists, update it
      const query = `
        UPDATE "movieList_YN100" 
        SET "addToWatchLater" = COALESCE(NULLIF("addToWatchLater", ''), $1)
        WHERE "imdbID" = $2 AND "userId" = $3
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        new Date().toISOString(),
        imdbID,
        userId
      ]);
      
      res.json({
        success: true,
        movie: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Error adding to watch later:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});