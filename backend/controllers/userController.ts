import asyncHandler from "express-async-handler";
import axios from "axios";
import { Request, Response } from "express";
import pool from "../config/db";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const SALT = process.env.SECRET_SALT;

export interface UserDetailsItem {
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: Date | null;
  phone: string;
  updatedAt: string;
}

export const getUserCountry = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const response = await axios.get('https://ipapi.co/country/');
      console.log("userController => getUserCountry => response.data: ", response.data);
      res.json({
        success: true,
        country: response.data
      });
    } catch (error: any) {
      console.error("userController => getUserCountry => error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error fetching country data",
      });
    }
  }
);
export const getUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "userId is required",
      });
      return;
    }

    const hashedUserId = crypto.createHash("sha256").update(userId + SALT).digest("hex");

    try {
      const result = await pool.query(
        `SELECT 
            pgp_sym_decrypt("firstName"::bytea, $2) AS "firstName",
            pgp_sym_decrypt("middleName"::bytea, $2) AS "middleName",
            pgp_sym_decrypt("lastName"::bytea, $2) AS "lastName",
            pgp_sym_decrypt("dateOfBirth"::bytea, $2) AS "dateOfBirth",
            pgp_sym_decrypt("country"::bytea, $2) AS "country",
            pgp_sym_decrypt("phone"::bytea, $2) AS "phone",
            "updatedAt"
         FROM "users_YN100"
         WHERE "userId" = $1`,
        [hashedUserId, SECRET_KEY]
      );

      console.log("userController => getUserDetails => success response: ", result.rows[0]);
      res.json({
        success: true,
        userDetails: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({
        success: false,
      });
    }
  }
);

export const updateUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, formDetails } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "userId is required",
      });
      return;
    }

    const hashedUserId = crypto.createHash("sha256").update(userId + SALT).digest("hex");

    try {

      const { firstName, middleName, lastName, dateOfBirth, country, phone } = formDetails;

      const updatedAt = new Date().toISOString();

      const updateQuery = `
    UPDATE "users_YN100"
    SET 
        "firstName" = pgp_sym_encrypt($1, $9), 
        "middleName" = pgp_sym_encrypt($2, $9), 
        "lastName" = pgp_sym_encrypt($3, $9), 
        "dateOfBirth" = pgp_sym_encrypt($4, $9), 
        "country" = pgp_sym_encrypt($5, $9),
        "phone" = pgp_sym_encrypt($6, $9), 
        "updatedAt" = $7
    WHERE "userId" = $8
    RETURNING 
        pgp_sym_decrypt("firstName"::bytea, $9) AS "firstName",
        pgp_sym_decrypt("middleName"::bytea, $9) AS "middleName",
        pgp_sym_decrypt("lastName"::bytea, $9) AS "lastName",
        pgp_sym_decrypt("dateOfBirth"::bytea, $9) AS "dateOfBirth",
        pgp_sym_decrypt("country"::bytea, $9) AS "country",
        pgp_sym_decrypt("phone"::bytea, $9) AS "phone",
        "updatedAt"
  `;
    
  const result = await pool.query(updateQuery, [
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    country,
    phone,
    updatedAt,
    hashedUserId, 
    SECRET_KEY 
  ]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      console.log("userController => updateUserDetails => success response: ", result.rows[0]);
      res.json({
        success: true,
        userDetails: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update user details",
      });
    }
  }
);

export const addUserIdInDB = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "userId is required",
      });
      return;
    }

    const hashedUserId = crypto.createHash("sha256").update(userId + SALT).digest("hex");

    try {
      await pool.query(
        `INSERT INTO "users_YN100" ("userId") 
         VALUES ($1) 
         ON CONFLICT ("userId") DO NOTHING`,
        [hashedUserId]
      );
      console.log("userController => addUserIdInDB => success");
      res.json({
        success: true
      });
    } catch (error: any) {
      console.error("Error adding user:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }
);

export const fetchOrAddUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        error: "userId is required",
      });
      return;
    }
    
    const hashedUserId = crypto.createHash("sha256").update(userId + SALT).digest("hex");
    
    try {
      // First, try to get the user details
      const result = await pool.query(
        `SELECT 
          pgp_sym_decrypt("firstName"::bytea, $2) AS "firstName",
          pgp_sym_decrypt("middleName"::bytea, $2) AS "middleName",
          pgp_sym_decrypt("lastName"::bytea, $2) AS "lastName",
          pgp_sym_decrypt("dateOfBirth"::bytea, $2) AS "dateOfBirth",
          pgp_sym_decrypt("country"::bytea, $2) AS "country",
          pgp_sym_decrypt("phone"::bytea, $2) AS "phone",
          "updatedAt"
        FROM "users_YN100"
        WHERE "userId" = $1`,
        [hashedUserId, SECRET_KEY]
      );
      
      // If user exists, return the details
      if (result.rows.length > 0) {
        console.log("userController => fetchOrAddUser => found existing user");
        res.json({
          success: true,
          userExists: true,
          userDetails: result.rows[0],
        });
        return;
      }
      
      // If user doesn't exist, create the user
      await pool.query(
        `INSERT INTO "users_YN100" ("userId")
        VALUES ($1)
        ON CONFLICT ("userId") DO NOTHING`,
        [hashedUserId]
      );
      
      console.log("userController => fetchOrAddUser => created new user");
      res.json({
        success: true,
        userExists: false,
        userDetails: null,
      });
      
    } catch (error: any) {
      console.error("Error in fetchOrAddUser:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }
);