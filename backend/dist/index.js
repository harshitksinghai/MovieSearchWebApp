"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
// import { initMovieListTable } from './models/movieList';
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const MODE = process.env.MODE || "development";
const CLIENT_URL = MODE === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;
// Allow requests from client URL
const corsOptions = {
    origin: CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true
};
// Initialize database tables
// const initDatabase = async () => {
//   try {
//     await initMovieListTable();
//     console.log('Database initialized successfully');
//   } catch (error) {
//     console.error('Database initialization failed:', error);
//     process.exit(1); // Exit if database initialization fails
//   }
// };
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/api/movies', movieRoutes_1.default);
// initDatabase().then(() => {
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// });
