import pool from "../../config/db";
import dotenv from 'dotenv';
import { UserAuthDetails } from "../utils/authTypes";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const authService = {

  userExistsByUserId: async (userId: string): Promise<boolean> => {
    console.log('Checking if user exists by userId');
    try{
      const result = await pool.query(
        'SELECT "id" FROM "users_YN100" WHERE "userId" = $1 LIMIT 1', 
        [userId]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.log("Unable to verify user, Error in authService => userExistsByEmail: ", error);
      throw error;
    }
  },

  fetchUserAuthDetailsByUserId: async (userId: string): Promise<UserAuthDetails | null> => {
    console.log('Checking if user exists by userId');
    try{
      const result = await pool.query(
        `SELECT "id", pgp_sym_decrypt("password"::bytea, $1) AS password, pgp_sym_decrypt("role"::bytea, $1) AS role, pgp_sym_decrypt("googleId"::bytea, $1) AS "googleId", pgp_sym_decrypt("refreshToken"::bytea, $1) AS "refreshToken" FROM "users_YN100" 
        WHERE "userId" = $2 LIMIT 1`, 
        [SECRET_KEY, userId]
      );
      
      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error) {
      console.log("Unable to fetch user details, Error in authService => fetchUserAuthDetailsByUserId: ", error);
      throw error;
    }
  },

  authenticateUser: async (userId: string, password: string): Promise<{id: number; role: string} | null> => {
    try {
      const userAuthenticateResult = await pool.query(
        'SELECT "id", pgp_sym_decrypt("role"::bytea, $1) AS role FROM "users_YN100" WHERE "userId" = $2 AND pgp_sym_decrypt("password"::bytea, $1) = $3 LIMIT 1',
        [SECRET_KEY, userId, password]
      );
      
      if (userAuthenticateResult.rows.length === 0) {
        return null;
      }
      console.log("DB Success: authservice => authenticateUser: response: ", userAuthenticateResult.rows[0])
      return userAuthenticateResult.rows[0];
    } catch (error) {
      console.error('DB Error: authService => authenticateUser: ', error);
      return null;
    }
  },

  updateRefreshTokenInUser: async (refreshTokenId: number | null, userId: string) => {
    try{
      await pool.query(
        'UPDATE "users_YN100" SET "refreshToken" = $1 WHERE "userId" = $2',
        [refreshTokenId, userId]
      );
      console.log("DB Success: authService => updateRefreshTokenInUser");
    } catch (error) {
      throw new Error("DB Error: authService => updateRefreshTokenInUser");
    }
  },

  registerUser: async (userId: string, password: string, role: string) => {
    try{
      await pool.query(
        `INSERT INTO "users_YN100" ("userId", "password", "role") 
        VALUES ($1, pgp_sym_encrypt($2, $3), pgp_sym_encrypt($4, $3))`,
        [userId, password, SECRET_KEY, role]
      );
      console.log("DB Success: authService => registerUser");
    } catch (error) {
      throw new Error(`DB Error: authService => registerUser: ${error}`);
    }
  },

  updatePasswordAndRefreshToken: async (userId: string, password: string, refreshTokenId: number) => {
    try{
      await pool.query(
        `UPDATE "users_YN100" SET "password" = $1, "refreshToken" = $2 WHERE "userId" = $3`,
        [password, refreshTokenId, userId]
      );
    } catch (error) {
      throw new Error("DB Error: authService => updatePasswordAndRefreshToken");
    }
  }
};