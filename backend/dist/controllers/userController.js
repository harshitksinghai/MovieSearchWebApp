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
exports.fetchOrAddUser = exports.addUserIdInDB = exports.updateUserDetails = exports.getUserDetails = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const SALT = process.env.SECRET_SALT;
exports.getUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({
            success: false,
            error: "userId is required",
        });
        return;
    }
    const hashedUserId = crypto_1.default.createHash("sha256").update(userId + SALT).digest("hex");
    try {
        const result = yield db_1.default.query(`SELECT 
            pgp_sym_decrypt("firstName"::bytea, $2) AS "firstName",
            pgp_sym_decrypt("middleName"::bytea, $2) AS "middleName",
            pgp_sym_decrypt("lastName"::bytea, $2) AS "lastName",
            pgp_sym_decrypt("dateOfBirth"::bytea, $2) AS "dateOfBirth",
            pgp_sym_decrypt("country"::bytea, $2) AS "country",
            pgp_sym_decrypt("phone"::bytea, $2) AS "phone",
            "updatedAt"
         FROM "users_YN100"
         WHERE "userId" = $1`, [hashedUserId, SECRET_KEY]);
        console.log("userController => getUserDetails => success response: ", result.rows[0]);
        res.json({
            success: true,
            userDetails: result.rows[0],
        });
    }
    catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            success: false,
        });
    }
}));
exports.updateUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, formDetails } = req.body;
    if (!userId) {
        res.status(400).json({
            success: false,
            error: "userId is required",
        });
        return;
    }
    const hashedUserId = crypto_1.default.createHash("sha256").update(userId + SALT).digest("hex");
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
        const result = yield db_1.default.query(updateQuery, [
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
    }
    catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user details",
        });
    }
}));
exports.addUserIdInDB = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({
            success: false,
            error: "userId is required",
        });
        return;
    }
    const hashedUserId = crypto_1.default.createHash("sha256").update(userId + SALT).digest("hex");
    try {
        yield db_1.default.query(`INSERT INTO "users_YN100" ("userId") 
         VALUES ($1) 
         ON CONFLICT ("userId") DO NOTHING`, [hashedUserId]);
        console.log("userController => addUserIdInDB => success");
        res.json({
            success: true
        });
    }
    catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
        });
    }
}));
exports.fetchOrAddUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({
            success: false,
            error: "userId is required",
        });
        return;
    }
    const hashedUserId = crypto_1.default.createHash("sha256").update(userId + SALT).digest("hex");
    try {
        // First, try to get the user details
        const result = yield db_1.default.query(`SELECT 
          pgp_sym_decrypt("firstName"::bytea, $2) AS "firstName",
          pgp_sym_decrypt("middleName"::bytea, $2) AS "middleName",
          pgp_sym_decrypt("lastName"::bytea, $2) AS "lastName",
          pgp_sym_decrypt("dateOfBirth"::bytea, $2) AS "dateOfBirth",
          pgp_sym_decrypt("country"::bytea, $2) AS "country",
          pgp_sym_decrypt("phone"::bytea, $2) AS "phone",
          "updatedAt"
        FROM "users_YN100"
        WHERE "userId" = $1`, [hashedUserId, SECRET_KEY]);
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
        yield db_1.default.query(`INSERT INTO "users_YN100" ("userId")
        VALUES ($1)
        ON CONFLICT ("userId") DO NOTHING`, [hashedUserId]);
        console.log("userController => fetchOrAddUser => created new user");
        res.json({
            success: true,
            userExists: false,
            userDetails: null,
        });
    }
    catch (error) {
        console.error("Error in fetchOrAddUser:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
        });
    }
}));
