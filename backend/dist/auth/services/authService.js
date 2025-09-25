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
exports.authService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
exports.authService = {
    userExistsByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Checking if user exists by userId');
        try {
            const result = yield db_1.default.query('SELECT "id" FROM "users_YN100" WHERE "userId" = $1 LIMIT 1', [userId]);
            return result.rows.length > 0;
        }
        catch (error) {
            console.log("Unable to verify user, Error in authService => userExistsByEmail: ", error);
            throw error;
        }
    }),
    fetchUserAuthDetailsByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Checking if user exists by userId');
        try {
            const result = yield db_1.default.query(`SELECT "id", pgp_sym_decrypt("password"::bytea, $1) AS password, pgp_sym_decrypt("role"::bytea, $1) AS role, pgp_sym_decrypt("googleId"::bytea, $1) AS "googleId", pgp_sym_decrypt("refreshToken"::bytea, $1) AS "refreshToken" FROM "users_YN100" 
        WHERE "userId" = $2 LIMIT 1`, [SECRET_KEY, userId]);
            if (result.rows.length === 0)
                return null;
            return result.rows[0];
        }
        catch (error) {
            console.log("Unable to fetch user details, Error in authService => fetchUserAuthDetailsByUserId: ", error);
            throw error;
        }
    }),
    authenticateUser: (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userAuthenticateResult = yield db_1.default.query('SELECT "id", pgp_sym_decrypt("role"::bytea, $1) AS role FROM "users_YN100" WHERE "userId" = $2 AND pgp_sym_decrypt("password"::bytea, $1) = $3 LIMIT 1', [SECRET_KEY, userId, password]);
            if (userAuthenticateResult.rows.length === 0) {
                return null;
            }
            console.log("DB Success: authservice => authenticateUser: response: ", userAuthenticateResult.rows[0]);
            return userAuthenticateResult.rows[0];
        }
        catch (error) {
            console.error('DB Error: authService => authenticateUser: ', error);
            return null;
        }
    }),
    updateRefreshTokenInUser: (refreshTokenId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db_1.default.query('UPDATE "users_YN100" SET "refreshToken" = $1 WHERE "userId" = $2', [refreshTokenId, userId]);
            console.log("DB Success: authService => updateRefreshTokenInUser");
        }
        catch (error) {
            throw new Error("DB Error: authService => updateRefreshTokenInUser");
        }
    }),
    registerUser: (userId, password, role) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db_1.default.query(`INSERT INTO "users_YN100" ("userId", "password", "role") 
        VALUES ($1, pgp_sym_encrypt($2, $3), pgp_sym_encrypt($4, $3))`, [userId, password, SECRET_KEY, role]);
            console.log("DB Success: authService => registerUser");
        }
        catch (error) {
            throw new Error(`DB Error: authService => registerUser: ${error}`);
        }
    }),
    updatePasswordAndRefreshToken: (userId, password, refreshTokenId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db_1.default.query(`UPDATE "users_YN100" SET "password" = $1, "refreshToken" = $2 WHERE "userId" = $3`, [password, refreshTokenId, userId]);
        }
        catch (error) {
            throw new Error("DB Error: authService => updatePasswordAndRefreshToken");
        }
    })
};
