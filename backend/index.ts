import express, { Express } from 'express';
import http, { Server } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes';
// import { initMovieListTable } from './models/movieList';

dotenv.config();
const app: Express = express();
const server: Server = http.createServer(app);

const MODE = process.env.MODE || "development";
const CLIENT_URL =
  MODE === "production"
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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/movies', movieRoutes);

// initDatabase().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
// });