"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieController_1 = require("../controllers/movieController");
const router = express_1.default.Router();
// Search and fetch routes
router.post('/search', movieController_1.searchMovies);
router.post('/imdbid', movieController_1.fetchMovieByImdbId);
router.post('/title', movieController_1.fetchMovieByTitle);
// Movie list management routes
router.post('/getlist', movieController_1.getMovieList);
router.post('/addtolist', movieController_1.addToList);
router.post('/removefromwatched', movieController_1.removeFromWatchedList);
router.post('/removefromwatchlater', movieController_1.removeFromWatchLater);
router.post('/updaterating', movieController_1.updateRating);
router.post('/addtowatchlater', movieController_1.addToWatchLater);
exports.default = router;
