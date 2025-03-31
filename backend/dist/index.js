"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const MODE = process.env.MODE || "development";
const CLIENT_URL = MODE === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;
const corsOptions = {
    origin: CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-encrypted-key'],
    exposedHeaders: ['x-encrypted-key']
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
                description: "Production Server"
            }
        ],
    },
    apis: [
        path_1.default.join(__dirname, "routes/*.ts"),
        path_1.default.join(__dirname, "routes/*.js")
    ],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use("/api/movies", movieRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
