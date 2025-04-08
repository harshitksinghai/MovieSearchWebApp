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


//users_YN100
// CREATE TABLE IF NOT EXISTS public."users_YN100"
// (
//     id SERIAL PRIMARY KEY,
//     "userId" character varying(36) COLLATE pg_catalog."default" NOT NULL,
//     "firstName" character varying(255) NOT NULL,
//     "middleName" character varying(255),
//     "lastName" character varying(255) NOT NULL,
//     "dateOfBirth" date NOT NULL,
//     "phone" character varying(20) NOT NULL,
//     "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
//     "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
//     CONSTRAINT user_unique UNIQUE ("userId")
// );


//users_YN100
// CREATE TABLE IF NOT EXISTS public."users_YN100"
// (
//     id SERIAL PRIMARY KEY,
//     "userId" character varying(64) NOT NULL,
//     "firstName" bytea,
//     "middleName" bytea,
//     "lastName" bytea,
//     "dateOfBirth" bytea,
//     "country" bytea,
//     "phone" bytea,
//     "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
//     "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
//     CONSTRAINT user_unique UNIQUE ("userId")
// );

//movieList_YN100
// CREATE TABLE IF NOT EXISTS public."movieList_YN100"
// (
//     id SERIAL PRIMARY KEY,
//     "imdbID" character varying(20) COLLATE pg_catalog."default" NOT NULL,
//     "addToWatchedList" character varying(30) COLLATE pg_catalog."default",
//     "addToWatchLater" character varying(30) COLLATE pg_catalog."default",
//     "ratingState" character varying(30) COLLATE pg_catalog."default",
//     "Type" character varying(30) COLLATE pg_catalog."default",
//     "userId" character varying(64) NOT NULL,
//     CONSTRAINT user_movie_unique UNIQUE ("userId", "imdbID"),
//     CONSTRAINT fk_user FOREIGN KEY ("userId")
//         REFERENCES public."users_YN100" ("userId") MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE CASCADE
// );



//pgcrypto extension
// SELECT * FROM pg_available_extensions WHERE name = 'pgcrypto';
// CREATE EXTENSION IF NOT EXISTS pgcrypto;
 
