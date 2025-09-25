// src/services/otpService.ts
import pool from "../../config/db";
import forge from 'node-forge';
import dotenv from 'dotenv';

dotenv.config();

const OTP_LENGTH = 6;
const OTP_CHARACTERS = '0123456789';

export const otpService = {
    generateOTP: (): string => {
      console.log('inside generateOTP in OTPService');
      let otp = '';
      for (let i = 0; i < OTP_LENGTH; i++) {
        const randomByte = forge.random.getBytesSync(1).charCodeAt(0);
        const index = randomByte % OTP_CHARACTERS.length;
        otp += OTP_CHARACTERS.charAt(index);
      }
      console.log('otp generated:', otp);
      return otp;
    },
  
    addOtpDetails: async (userId: string, otp: string): Promise<void> => {
      console.log('inside addOTPDetails in OTPService');
  
      const expirationTime = new Date();
      expirationTime.setSeconds(expirationTime.getSeconds() + 300);

      try{
        const userIdExists = await pool.query(
          'SELECT "id" from "otpVerification_YN100" WHERE "userId" = $1',
          [userId]
        )
        if(userIdExists.rows.length > 0){
          await pool.query(
            'UPDATE "otpVerification_YN100" SET "otp" = $1, "expirationTime" = $2 WHERE "userId" = $3',
            [otp, expirationTime, userId]
          )
          console.log("otpService => addOtpDetails success");
          return;
        }
    
        await pool.query(
          'INSERT INTO "otpVerification_YN100" ("userId", "otp", "expirationTime") VALUES ($1, $2, $3)',
          [userId, otp, expirationTime]
        );
        console.log("otpService => addOtpDetails success");
      } catch (error) {
        console.log("Failed to add otp in db. Error in otpService => addOtpDetails: ", error);
        throw error;
      }
    },
  
    verifyOTP: async (userId: string, otp: string): Promise<boolean> => {
      console.log('inside verifyOTP in OTPService');
  
      try {
        const otpResult = await pool.query(
          'SELECT "userId", "otp", "expirationTime" FROM "otpVerification_YN100" WHERE "otp" = $1',
          [otp]
        );
  
        if (otpResult.rows.length === 0) {
          console.log('otp does not exist in db');
          return false;
        }
  
        const otpRecord = otpResult.rows[0];
  
        if (otpRecord.userId !== userId) {
          console.log('Invalid otp!');
          return false;
        }
  
        const now = new Date();
        const expirationTime = new Date(otpRecord.expirationTime);
  
        if (expirationTime > now) {
          console.log('otp verified successfully, otp still not expired');
          await pool.query('DELETE FROM "otpVerification_YN100" WHERE "otp" = $1', [otp]);
          return true;
        }
  
        console.log('otp expired');
        await pool.query('DELETE FROM "otpVerification_YN100" WHERE "otp" = $1', [otp]);
        return false;
      } catch (error) {
        console.error('Error verifying OTP', error); // Changed LOG.error to console.error for safety
        return false;
      }
    },
  
    clearExpiredOTPs: async (): Promise<void> => {
      console.log('inside clearExpiredOTPs in OTPService');
      const now = new Date();
      await pool.query(
        'DELETE FROM "otpVerification_YN100" WHERE "expirationTime" < $1',
        [now]
      );
    }
};
