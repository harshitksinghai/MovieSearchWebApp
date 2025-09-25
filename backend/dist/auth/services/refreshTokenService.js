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
exports.deleteById = exports.refreshTokenService = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../../config/db"));
dotenv_1.default.config();
const REFRESH_TOKEN_SLIDING_WINDOW_PERIOD = parseInt(process.env.REFRESH_TOKEN_SLIDING_WINDOW_PERIOD, 10);
const SECRET_KEY = process.env.SECRET_KEY;
exports.refreshTokenService = {
    generateToken: () => {
        const bytes = node_forge_1.default.random.getBytesSync(32); // 32 bytes = 256-bit
        const token = node_forge_1.default.util.bytesToHex(bytes);
        console.log("refreshTokenService => generateToken: token: ", token);
        return token;
    },
    createRefreshToken: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        let token;
        let tokenExists = true;
        do {
            token = exports.refreshTokenService.generateToken();
            const result = yield db_1.default.query('SELECT id FROM "refreshToken_YN100" WHERE pgp_sym_decrypt("token"::bytea, $1) = $2 LIMIT 1', [SECRET_KEY, token]);
            tokenExists = result.rows.length > 0;
        } while (tokenExists);
        console.log("i am heree");
        const expirationTime = new Date(Date.now() + REFRESH_TOKEN_SLIDING_WINDOW_PERIOD);
        console.log("I am here");
        const saveResult = yield db_1.default.query(`INSERT INTO "refreshToken_YN100" ("token", "expirationTime", "userId") 
    VALUES (pgp_sym_encrypt($1, $2), $3, $4) 
    RETURNING 
        "id"`, [token, SECRET_KEY, expirationTime, userId]);
        const refreshToken = {
            id: saveResult.rows[0].id,
            token: token,
            expirationTime: expirationTime,
            userId: userId,
        };
        console.log("DB Success: refreshTokenService => createRefreshToken: refreshToken: ", refreshToken);
        return refreshToken;
    }),
    findByToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query(`SELECT "id", "expirationTime", "userId" FROM "refreshToken_YN100" WHERE pgp_sym_decrypt("token"::bytea, $1) = $2 LIMIT 1`, [SECRET_KEY, token]);
        if (result.rows.length === 0) {
            return null;
        }
        return {
            id: result.rows[0].id,
            token: token,
            expirationTime: result.rows[0].expirationTime,
            userId: result.rows[0].userId,
        };
    }),
    deleteByToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = yield exports.refreshTokenService.findByToken(token);
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }
        yield db_1.default.query(`DELETE FROM "refreshToken_YN100" WHERE id = $1`, [
            refreshToken.id,
        ]);
        return "Refresh token deleted successfully!";
    }),
    verifyExpiration: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        if (token.expirationTime < now) {
            console.log("Refresh token expired!");
            yield db_1.default.query(`DELETE FROM "refreshToken_YN100" WHERE id = $1`, [token.id]);
            return null;
        }
        const slidingWindowThreshold = new Date(now.getTime() + REFRESH_TOKEN_SLIDING_WINDOW_PERIOD);
        if (token.expirationTime < slidingWindowThreshold) {
            console.log("Incrementing the expiration time of the refresh token");
            const newExpiryDate = new Date(now.getTime() + REFRESH_TOKEN_SLIDING_WINDOW_PERIOD);
            const newToken = exports.refreshTokenService.generateToken();
            const updateResult = yield db_1.default.query(`UPDATE "refreshToken_YN100" 
        SET token = pgp_sym_encrypt($1, $2), "expirationTime" = $3 WHERE id = $4 
        RETURNING 
        "id",
        pgp_sym_decrypt("token"::bytea, $2) AS "token", 
        "expirationTime",
        "userId"`, [newToken, SECRET_KEY, newExpiryDate, token.id]);
            return {
                id: updateResult.rows[0].id,
                token: updateResult.rows[0].token,
                expirationTime: updateResult.rows[0].expirationTime,
                userId: updateResult.rows[0].userId,
            };
        }
        return token;
    }),
    getJwtRefreshExpirationMs: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = yield exports.refreshTokenService.findByToken(token);
        if (!refreshToken) {
            throw new Error("Invalid refresh token.");
        }
        const now = new Date();
        const expirationTime = refreshToken.expirationTime;
        if (expirationTime < now) {
            throw new Error("Refresh token has already expired.");
        }
        return expirationTime.getTime() - now.getTime();
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.query(`DELETE FROM "refreshToken_YN100" WHERE id = $1`, [id]);
    })
};
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query("DELETE FROM refresh_tokens WHERE id = $1", [id]);
});
exports.deleteById = deleteById;
