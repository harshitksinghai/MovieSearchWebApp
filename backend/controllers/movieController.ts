import asyncHandler from "express-async-handler";
import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
import pool from "../config/db";
import crypto from "crypto";

dotenv.config();
const MODE = process.env.MODE;
// const SECRET_KEY = process.env.SECRET_KEY;
const SALT = process.env.SECRET_SALT;
const API_KEY = process.env.OMDB_API_KEY;
const API_URL =
  MODE === "production"
    ? process.env.OMDB_API_URL_PROD
    : process.env.OMDB_API_URL_DEV;

export interface MovieItem {
  imdbID: string;
  addToWatchedList: string | null;
  addToWatchLater: string | null;
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
  totalSeasons?: string;
}

export const searchMovies = asyncHandler(
  async (req: Request, res: Response) => {
    const { query, year, type, page = 1 } = req.body;

    if (!query) {
      res.status(400).json({
        success: false,
        error: "Search query is required",
      });
      return;
    }

    try {
      let url = `${API_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(
        query
      )}&page=${page}`;
      if (year) url += `&y=${encodeURIComponent(year)}`;
      if (type) url += `&type=${encodeURIComponent(type)}`;

      // console.log('Backend Request URL:', url);
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
          error: "No movies found",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch movies",
      });
    }
  }
);

// utility
export const getMovieDetailsFromOMDB = async (imdbID: string): Promise<OmdbDetailResponse | null> => {
  try {
    const url = `${API_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
    const response = await axios.get<OmdbDetailResponse>(url);
    
    if (response.data.Response === "True") {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("OMDB API Error:", error);
    return null;
  }
};

export const fetchMovieByImdbId = asyncHandler(
  async (req: Request, res: Response) => {
    const { imdbID } = req.body;

    if (!imdbID) {
      res.status(400).json({
        success: false,
        error: "IMDB ID is required",
      });
      return;
    }

    try {
      const movieData = await getMovieDetailsFromOMDB(imdbID);
      
      if (movieData) {
        res.json({
          success: true,
          movie: movieData,
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Movie not found",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch movie details",
      });
    }
  }
);

export const getMovieListWithDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId as string;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required"
      });
      return;
    }

    const hashedUserId = crypto
      .createHash("sha256")
      .update(userId + SALT)
      .digest("hex");

    try {
      const dbResult = await pool.query(
        `SELECT "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type" 
         FROM "movieList_YN100"
         WHERE "userId" = $1`,
        [hashedUserId]
      );
      
      const dbMovies = dbResult.rows as MovieItem[];
      
      if (dbMovies.length === 0) {
        res.json({
          success: true,
          movieList: []
        });
        return;
      }

      const movieDetailsPromises = dbMovies.map(async (movie: MovieItem) => {
        const apiData = await getMovieDetailsFromOMDB(movie.imdbID);
        
        if (apiData) {
          return {
            ...movie,
            Title: apiData.Title,
            Year: apiData.Year,
            Rated: apiData.Rated,
            Released: apiData.Released,
            Runtime: apiData.Runtime,
            Genre: apiData.Genre,
            Director: apiData.Director,
            Writer: apiData.Writer,
            Actors: apiData.Actors,
            Plot: apiData.Plot,
            Language: apiData.Language,
            Country: apiData.Country,
            Awards: apiData.Awards,
            Poster: apiData.Poster,
            Ratings: apiData.Ratings,
            Metascore: apiData.Metascore,
            imdbRating: apiData.imdbRating,
            imdbVotes: apiData.imdbVotes,
            totalSeasons: apiData.totalSeasons,
            BoxOffice: apiData.BoxOffice
          };
        }
        
        return movie;
      });
      const movieListWithDetails = await Promise.all(movieDetailsPromises);

      res.json({
        success: true,
        movieList: movieListWithDetails
      });
      
    } catch (error) {
      console.error("Error fetching movie list with details:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch movie list with details"
      });
    }
  }
);

export const fetchMovieByTitle = asyncHandler(
  async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: "Title is required",
      });
      return;
    }

    try {
      const url = `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(
        title
      )}&plot=full`;

      // console.log('Backend Title Request URL:', url);
      const response = await axios.get<OmdbDetailResponse>(url);

      if (response.data.Response === "True") {
        res.json({
          success: true,
          movie: response.data,
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Movie not found",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch movie details",
      });
    }
  }
);

export const removeFromWatchedList = asyncHandler(
  async (req: Request, res: Response) => {
    const { imdbID, userId } = req.body;

    if (!imdbID) {
      res.status(400).json({
        success: false,
        error: "IMDB ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    const hashedUserId = crypto
      .createHash("sha256")
      .update(userId + SALT)
      .digest("hex");

    try {
      const checkResult = await pool.query(
        `SELECT * FROM "movieList_YN100" 
         WHERE "imdbID" = $1 
         AND "userId" = $2`,
        [imdbID, hashedUserId]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Movie not found in your list",
        });
        return;
      }

      const movie = checkResult.rows[0];

      if (movie.addToWatchLater === null) {
        await pool.query(
          `DELETE FROM "movieList_YN100" 
           WHERE "imdbID" = $1 
           AND "userId" = $2`,
          [imdbID, hashedUserId]
        );
      } else {
        await pool.query(
          `UPDATE "movieList_YN100" 
           SET "addToWatchedList" = $1, "ratingState" = $2 
           WHERE "imdbID" = $3 
           AND "userId" = $4`,
          [null, "none", imdbID, hashedUserId]
        );
      }

      res.json({
        success: true,
        message: "Movie removed from watched list",
      });
    } catch (error) {
      console.error("Error removing from watched list:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

export const removeFromWatchLater = asyncHandler(
  async (req: Request, res: Response) => {
    const { imdbID, userId } = req.body;

    if (!imdbID) {
      res.status(400).json({
        success: false,
        error: "IMDB ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    const hashedUserId = crypto
      .createHash("sha256")
      .update(userId + SALT)
      .digest("hex");

    try {
      const checkResult = await pool.query(
        `SELECT * FROM "movieList_YN100" 
         WHERE "imdbID" = $1 
         AND "userId" = $2`,
        [imdbID, hashedUserId]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "Movie not found in your list",
        });
        return;
      }

      const movie = checkResult.rows[0];

      if (movie.addToWatchedList === null) {
        await pool.query(
          `DELETE FROM "movieList_YN100" 
           WHERE "imdbID" = $1 
           AND "userId" = $2`,
          [imdbID, hashedUserId]
        );
      } else {
        await pool.query(
          `UPDATE "movieList_YN100" 
           SET "addToWatchLater" = $1 
           WHERE "imdbID" = $2 
           AND "userId" = $3`, // Use the hashed userId directly
          [null, imdbID, hashedUserId]
        );
      }

      res.json({
        success: true,
        message: "Movie removed from watch later list",
      });
    } catch (error) {
      console.error("Error removing from watch later list:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

export const updateRating = asyncHandler(
  async (req: Request, res: Response) => {
    const { imdbID, ratingState, Type, userId } = req.body;

    if (!imdbID) {
      res.status(400).json({
        success: false,
        error: "IMDB ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    const hashedUserId = crypto
      .createHash("sha256")
      .update(userId + SALT)
      .digest("hex");

    try {
      await pool.query(
        `INSERT INTO "users_YN100" ("userId") 
         VALUES ($1) 
         ON CONFLICT ("userId") DO NOTHING`,
        [hashedUserId]
      );

      const checkResult = await pool.query(
        `SELECT * FROM "movieList_YN100" 
         WHERE "imdbID" = $1 
         AND "userId" = $2`,
        [imdbID, hashedUserId]
      );

      if (checkResult.rows.length === 0) {
        const query = `
      INSERT INTO "movieList_YN100" 
        ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
    `;

        const result = await pool.query(query, [
          imdbID,
          new Date().toISOString(),
          null,
          ratingState,
          Type,
          hashedUserId,
        ]);
        res.json({
          success: true,
          movie: result.rows[0],
        });
      } else {
        const query = `
  UPDATE "movieList_YN100" 
  SET "ratingState" = $1,
      "addToWatchedList" = 
        CASE 
          WHEN "addToWatchedList" IS NULL THEN $2
          ELSE "addToWatchedList"
        END,
      "addToWatchLater" = $3
  WHERE "imdbID" = $4 
    AND "userId" = $5  -- Use hashed userId directly
  RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
`;

        const result = await pool.query(query, [
          ratingState,
          new Date().toISOString(),
          null,
          imdbID,
          hashedUserId,
        ]);

        res.json({
          success: true,
          movie: result.rows[0],
        });
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

export const addToWatchLater = asyncHandler(
  async (req: Request, res: Response) => {
    const { imdbID, ratingState, Type, userId } = req.body;

    if (!imdbID) {
      res.status(400).json({
        success: false,
        error: "IMDB ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    const hashedUserId = crypto
      .createHash("sha256")
      .update(userId + SALT)
      .digest("hex");

    try {
      await pool.query(
        'INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING',
        [hashedUserId]
      );

      const checkResult = await pool.query(
        `SELECT * FROM "movieList_YN100" 
         WHERE "imdbID" = $1 AND "userId" = $2`,
        [imdbID, hashedUserId]
      );

      if (checkResult.rows.length === 0) {
        const query = `
      INSERT INTO "movieList_YN100" 
      ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
    `;

        const result = await pool.query(query, [
          imdbID,
          null,
          new Date().toISOString(),
          ratingState,
          Type,
          hashedUserId,
        ]);
        res.json({
          success: true,
          movie: result.rows[0],
        });
      } else {
        const query = `
  UPDATE "movieList_YN100" 
  SET "addToWatchLater" = 
    CASE 
      WHEN "addToWatchLater" IS NULL THEN $1 
      ELSE "addToWatchLater" 
    END
  WHERE "imdbID" = $2 AND "userId" = $3
  RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
`;

        const result = await pool.query(query, [
          new Date().toISOString(),
          imdbID,
          hashedUserId,
        ]);

        res.json({
          success: true,
          movie: result.rows[0],
        });
      }
    } catch (error) {
      console.error("Error adding to watch later:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);
