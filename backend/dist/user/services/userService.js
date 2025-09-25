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
exports.userService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const SECRET_KEY = process.env.SECRET_KEY;
exports.userService = {
    findUserByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.query(`SELECT 
                    pgp_sym_decrypt("userId"::bytea, $2) AS "userId",
                    pgp_sym_decrypt("firstName"::bytea, $2) AS "firstName",
                    pgp_sym_decrypt("middleName"::bytea, $2) AS "middleName",
                    pgp_sym_decrypt("lastName"::bytea, $2) AS "lastName",
                    pgp_sym_decrypt("dateOfBirth"::bytea, $2) AS "dateOfBirth",
                    pgp_sym_decrypt("country"::bytea, $2) AS "country",
                    pgp_sym_decrypt("phone"::bytea, $2) AS "phone",
                    "updatedAt"
                 FROM "users_YN100"
                 WHERE find_user_by_decrypted_id("userId", $1, $2) = true
                 LIMIT 1`, [userId, SECRET_KEY]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in findUserByOriginalUserId:", error);
            throw error;
        }
    }),
};
