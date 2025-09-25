import pool from "../../config/db";

const SECRET_KEY = process.env.SECRET_KEY;

export const userService = {
  findUserByUserId: async (userId: string) => {
    try {
      const result = await pool.query(
        `SELECT 
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
                 LIMIT 1`,
        [userId, SECRET_KEY]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error in findUserByOriginalUserId:", error);
      throw error;
    }
  },
};
