"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMovieListTable = void 0;
// models/movieList.ts
const db_1 = __importDefault(require("../config/db"));
// export interface MovieListItem {
//   id: number;
//   imdbID: string;
//   addToWatchedList: string | null; // ISO date string
//   addToWatchLater: string | null; // ISO date string
//   ratingState: "none" | "dislike" | "like" | "love";
//   Type: "All" | "Movies" | "Series" | "Games";
// }
// Function to initialize the table when the app starts
const initMovieListTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tableExists = yield db_1.default.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = "movieList_YN100"
      );
    `);
        if (!tableExists.rows[0].exists) {
            yield db_1.default.query(`
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
        }
        else {
            console.log("MovieList table already exists");
        }
    }
    catch (error) {
        console.error("Error initializing movie list table:", error);
        throw error;
    }
});
exports.initMovieListTable = initMovieListTable;
