// models/movieList.ts
import pool from "../config/db";

// export interface MovieListItem {
//   id: number;
//   imdbID: string;
//   addToWatchedList: string | null; // ISO date string
//   addToWatchLater: string | null; // ISO date string
//   ratingState: "none" | "dislike" | "like" | "love";
//   Type: "All" | "Movies" | "Series" | "Games";
// }

// Function to initialize the table when the app starts
export const initMovieListTable = async (): Promise<void> => {
  try {
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = "movieList_YN100"
      );
    `);

    if (!tableExists.rows[0].exists) {
      await pool.query(`
       CREATE TABLE "movieList_YN100" (
  id SERIAL PRIMARY KEY,
  "imdbID" VARCHAR(20) NOT NULL,
  "addToWatchedList" VARCHAR(30),
  "addToWatchLater" VARCHAR(30),
  "ratingState" VARCHAR(10) CHECK ("ratingState" IN ('none', 'dislike', 'like', 'love')),
  "Type" VARCHAR(10) CHECK ("Type" IN ('none', 'movie', 'series', 'game'))
);
      `);
      console.log("MovieList table created successfully");
    } else {
      console.log("MovieList table already exists");
    }
  } catch (error) {
    console.error("Error initializing movie list table:", error);
    throw error;
  }
};
