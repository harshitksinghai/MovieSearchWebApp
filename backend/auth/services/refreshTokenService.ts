import forge from "node-forge";
import dotenv from "dotenv";
import pool from "../../config/db";
import { RefreshToken } from "../utils/authTypes";

dotenv.config();

const REFRESH_TOKEN_SLIDING_WINDOW_PERIOD = parseInt(
  process.env.REFRESH_TOKEN_SLIDING_WINDOW_PERIOD!,
  10
);
const SECRET_KEY = process.env.SECRET_KEY;

export const refreshTokenService = {

    generateToken: (): string => {
        const bytes = forge.random.getBytesSync(32); // 32 bytes = 256-bit
        const token = forge.util.bytesToHex(bytes);
        console.log("refreshTokenService => generateToken: token: ", token);
        return token;
    },

  createRefreshToken: async (userId: string): Promise<RefreshToken> => {
    let token: string;
    let tokenExists = true;

    do {
      token = refreshTokenService.generateToken();

      const result = await pool.query(
        'SELECT id FROM "refreshToken_YN100" WHERE pgp_sym_decrypt("token"::bytea, $1) = $2 LIMIT 1',
        [SECRET_KEY, token]
      );

      tokenExists = result.rows.length > 0;
    } while (tokenExists);
    console.log("i am heree")
    const expirationTime = new Date(
      Date.now() + REFRESH_TOKEN_SLIDING_WINDOW_PERIOD
    );
    console.log("I am here")
    const saveResult = await pool.query(
      `INSERT INTO "refreshToken_YN100" ("token", "expirationTime", "userId") 
    VALUES (pgp_sym_encrypt($1, $2), $3, $4) 
    RETURNING 
        "id"`,
      [token, SECRET_KEY, expirationTime, userId]
    );

    const refreshToken: RefreshToken = {
        id: saveResult.rows[0].id,
        token: token,
        expirationTime: expirationTime,
        userId: userId,
    };
    console.log("DB Success: refreshTokenService => createRefreshToken: refreshToken: ", refreshToken);
    return refreshToken;
  },

  findByToken: async (token: string): Promise<RefreshToken | null> => {
    const result = await pool.query(
      `SELECT "id", "expirationTime", "userId" FROM "refreshToken_YN100" WHERE pgp_sym_decrypt("token"::bytea, $1) = $2 LIMIT 1`,
      [SECRET_KEY, token]
    );
  
    if (result.rows.length === 0) {
      return null;
    }
  
    return {
      id: result.rows[0].id,
      token: token,
      expirationTime: result.rows[0].expirationTime,
      userId: result.rows[0].userId,
    };
  },

  deleteByToken: async (token: string): Promise<string> => {
    const refreshToken = await refreshTokenService.findByToken(token);
  
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
  
    await pool.query(`DELETE FROM "refreshToken_YN100" WHERE id = $1`, [
      refreshToken.id,
    ]);
  
    return "Refresh token deleted successfully!";
  },

  verifyExpiration: async (token: RefreshToken): Promise<RefreshToken | null> => {
    const now = new Date();
  
    if (token.expirationTime < now) {
      console.log("Refresh token expired!");
  
      await pool.query(`DELETE FROM "refreshToken_YN100" WHERE id = $1`, [token.id]);
  
      return null;
    }
  
    const slidingWindowThreshold = new Date(
      now.getTime() + REFRESH_TOKEN_SLIDING_WINDOW_PERIOD
    );
    if (token.expirationTime < slidingWindowThreshold) {
      console.log("Incrementing the expiration time of the refresh token");
  
      const newExpiryDate = new Date(
        now.getTime() + REFRESH_TOKEN_SLIDING_WINDOW_PERIOD
      );
      const newToken = refreshTokenService.generateToken();
  
      const updateResult = await pool.query(
        `UPDATE "refreshToken_YN100" 
        SET token = pgp_sym_encrypt($1, $2), "expirationTime" = $3 WHERE id = $4 
        RETURNING 
        "id",
        pgp_sym_decrypt("token"::bytea, $2) AS "token", 
        "expirationTime",
        "userId"`,
        [newToken, SECRET_KEY, newExpiryDate, token.id]
      );
  
      return {
        id: updateResult.rows[0].id,
        token: updateResult.rows[0].token,
        expirationTime: updateResult.rows[0].expirationTime,
        userId: updateResult.rows[0].userId,
      };
    }
  
    return token;
  },

  getJwtRefreshExpirationMs: async (token: string): Promise<number> => {
    const refreshToken = await refreshTokenService.findByToken(token);
  
    if (!refreshToken) {
      throw new Error("Invalid refresh token.");
    }
  
    const now = new Date();
    const expirationTime = refreshToken.expirationTime;
  
    if (expirationTime < now) {
      throw new Error("Refresh token has already expired.");
    }
  
    return expirationTime.getTime() - now.getTime();
  },

  deleteById: async (id: number): Promise<void> => {
    await pool.query(`DELETE FROM "refreshToken_YN100" WHERE id = $1`, [id]);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM refresh_tokens WHERE id = $1", [id]);
};
