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
exports.addToWatchLater = exports.updateRating = exports.removeFromWatchLater = exports.removeFromWatchedList = exports.addToList = exports.getMovieList = exports.fetchMoviesByImdbId = exports.fetchPopularMovies = exports.searchMovies = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../config/db"));
dotenv_1.default.config();
const MODE = process.env.MODE;
const API_KEY = process.env.OMDB_API_KEY;
const API_URL = MODE === "production"
    ? process.env.OMDB_API_URL_PROD
    : process.env.OMDB_API_URL_DEV;
const POPULAR_MOVIES = [
    "Avatar", "Inception", "Interstellar", "The Dark Knight",
    "Spider-Man", "Iron Man", "Black Panther", "Wonder Woman"
];
const POPULAR_SERIES = [
    "Breaking Bad", "Game of Thrones", "Stranger Things", "The Crown",
    "The Mandalorian", "Friends", "The Office", "Better Call Saul"
];
exports.searchMovies = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (year)
            url += `&y=${encodeURIComponent(year)}`;
        if (type)
            url += `&type=${encodeURIComponent(type)}`;
        console.log('Backend Request URL:', url);
        const response = yield axios_1.default.get(url);
        if (response.data.Response === "True") {
            res.json({
                success: true,
                movies: response.data.Search,
                totalPages: Math.ceil(Number(response.data.totalResults) / 10),
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: "No movies found"
            });
        }
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch movies"
        });
    }
}));
exports.fetchPopularMovies = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    try {
        const titles = type === "series" ? POPULAR_SERIES : POPULAR_MOVIES;
        const promises = titles.map(title => axios_1.default.get(`${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}${type ? `&type=${type}` : ''}`));
        const results = yield Promise.all(promises);
        const validResults = results
            .map(response => response.data)
            .filter(data => data.Response === "True");
        res.json({
            success: true,
            movies: validResults
        });
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch popular movies"
        });
    }
}));
exports.fetchMoviesByImdbId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.get(url);
        if (response.data.Response === "True") {
            res.json({
                success: true,
                movie: response.data
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: "Movie not found"
            });
        }
    }
    catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch movie details"
        });
    }
}));
exports.getMovieList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const userId = req.body.userId;
    if (!userId) {
        res.status(400).json({
            success: false
        });
        return;
    }
    try {
        const result = yield db_1.default.query('SELECT "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type" FROM "movieList_YN100" WHERE "userId" = $1', [userId]);
        res.json({
            success: true,
            movieList: result.rows
        });
    }
    catch (error) {
        console.error('Error fetching list:', error);
        res.status(500).json({
            success: false
        });
    }
}));
exports.addToList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.default.query('INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING', [userId]);
        const watchedDate = isAddToWatchedList ? new Date().toISOString() : null;
        const watchLaterDate = isAddToWatchLater ? new Date().toISOString() : null;
        const query = `
      INSERT INTO "movieList_YN100" ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("userId", "imdbID") 
      DO UPDATE SET 
        "addToWatchedList" = $2,
        "addToWatchLater" = $3,
        "ratingState" = $4,
        "Type" = $5
      RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
    `;
        const result = yield db_1.default.query(query, [imdbID, watchedDate, watchLaterDate, ratingState, Type, userId]);
        res.json({
            success: true,
            movie: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error adding to list:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}));
exports.removeFromWatchedList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const checkResult = yield db_1.default.query('SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', [imdbID, userId]);
        if (checkResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                error: "Movie not found in your list"
            });
            return;
        }
        const movie = checkResult.rows[0];
        if (movie.addToWatchLater === null) {
            yield db_1.default.query('DELETE FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', [imdbID, userId]);
        }
        else {
            yield db_1.default.query('UPDATE "movieList_YN100" SET "addToWatchedList" = $1, "ratingState" = $2 WHERE "imdbID" = $3 AND "userId" = $4', [null, 'none', imdbID, userId]);
        }
        res.json({
            success: true,
            message: "Movie removed from watched list"
        });
    }
    catch (error) {
        console.error('Error removing from watched list:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}));
exports.removeFromWatchLater = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const checkResult = yield db_1.default.query('SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', [imdbID, userId]);
        if (checkResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                error: "Movie not found in your list"
            });
            return;
        }
        const movie = checkResult.rows[0];
        if (movie.addToWatchedList === null) {
            yield db_1.default.query('DELETE FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', [imdbID, userId]);
        }
        else {
            yield db_1.default.query('UPDATE "movieList_YN100" SET "addToWatchLater" = $1 WHERE "imdbID" = $2 AND "userId" = $3', [null, imdbID, userId]);
        }
        res.json({
            success: true,
            message: "Movie removed from watch later list"
        });
    }
    catch (error) {
        console.error('Error removing from watch later list:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}));
exports.updateRating = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.default.query('INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING', [userId]);
        const checkResult = yield db_1.default.query('SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', [imdbID, userId]);
        if (checkResult.rows.length === 0) {
            const query = `
        INSERT INTO "movieList_YN100" ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
      `;
            const result = yield db_1.default.query(query, [
                imdbID,
                new Date().toISOString(),
                null,
                ratingState,
                Type,
                userId
            ]);
            res.json({
                success: true,
                movie: result.rows[0]
            });
        }
        else {
            const query = `
        UPDATE "movieList_YN100" 
        SET "ratingState" = $1, 
            "addToWatchedList" = 
              CASE 
                WHEN "addToWatchedList" IS NULL THEN $2 
                ELSE "addToWatchedList" 
              END,
            "addToWatchLater" = $3
        WHERE "imdbID" = $4 AND "userId" = $5
        RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
      `;
            const result = yield db_1.default.query(query, [
                ratingState,
                new Date().toISOString(),
                null,
                imdbID,
                userId
            ]);
            res.json({
                success: true,
                movie: result.rows[0]
            });
        }
    }
    catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}));
exports.addToWatchLater = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.default.query('INSERT INTO "users_YN100" ("userId") VALUES ($1) ON CONFLICT ("userId") DO NOTHING', [userId]);
        const checkResult = yield db_1.default.query('SELECT * FROM "movieList_YN100" WHERE "imdbID" = $1 AND "userId" = $2', [imdbID, userId]);
        if (checkResult.rows.length === 0) {
            const query = `
        INSERT INTO "movieList_YN100" ("imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type", "userId") 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING "imdbID", "addToWatchedList", "addToWatchLater", "ratingState", "Type";
      `;
            const result = yield db_1.default.query(query, [
                imdbID,
                null,
                new Date().toISOString(),
                ratingState,
                Type,
                userId
            ]);
            res.json({
                success: true,
                movie: result.rows[0]
            });
        }
        else {
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
            const result = yield db_1.default.query(query, [
                new Date().toISOString(),
                imdbID,
                userId
            ]);
            res.json({
                success: true,
                movie: result.rows[0]
            });
        }
    }
    catch (error) {
        console.error('Error adding to watch later:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}));
