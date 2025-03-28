import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import movieRoutes from "./routes/movieRoutes";
import userRoutes from "./routes/userRoutes";
import path from "path";

dotenv.config();
const app: Express = express();

const MODE = process.env.MODE || "development";
const CLIENT_URL =
  MODE === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;

const SERVER_URL =
  MODE === "production"
    ? process.env.SERVER_URL_PROD
    : process.env.SERVER_URL_DEV;

const corsOptions = {
  origin: CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MovieKeeper",
      version: "1.0.0",
      description: "Manage your movies/series efficiently",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your Cognito Access Token"
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    servers: [
      {
        url: `${process.env.SERVER_URL_DEV}`,
        description: "Development Server"
      },
      {
        url: `${process.env.SERVER_URL_PROD}`,
        description: "Development Server"
      }
    ],
  },
  apis: [
    path.join(__dirname, "routes/*.ts"),
    path.join(__dirname, "routes/*.js")
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const specs = swaggerJsDoc(options);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});