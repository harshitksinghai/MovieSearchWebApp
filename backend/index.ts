import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app: Express = express();

const MODE = process.env.MODE || "development";
const CLIENT_URL =
  MODE === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;

const corsOptions = {
  origin: CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);


  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
