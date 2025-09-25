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
exports.otpService = void 0;
// src/services/otpService.ts
const db_1 = __importDefault(require("../../config/db"));
const node_forge_1 = __importDefault(require("node-forge"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OTP_LENGTH = 6;
const OTP_CHARACTERS = '0123456789';
exports.otpService = {
    generateOTP: () => {
        console.log('inside generateOTP in OTPService');
        let otp = '';
        for (let i = 0; i < OTP_LENGTH; i++) {
            const randomByte = node_forge_1.default.random.getBytesSync(1).charCodeAt(0);
            const index = randomByte % OTP_CHARACTERS.length;
            otp += OTP_CHARACTERS.charAt(index);
        }
        console.log('otp generated:', otp);
        return otp;
    },
    addOtpDetails: (userId, otp) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('inside addOTPDetails in OTPService');
        const expirationTime = new Date();
        expirationTime.setSeconds(expirationTime.getSeconds() + 300);
        try {
            const userIdExists = yield db_1.default.query('SELECT "id" from "otpVerification_YN100" WHERE "userId" = $1', [userId]);
            if (userIdExists.rows.length > 0) {
                yield db_1.default.query('UPDATE "otpVerification_YN100" SET "otp" = $1, "expirationTime" = $2 WHERE "userId" = $3', [otp, expirationTime, userId]);
                console.log("otpService => addOtpDetails success");
                return;
            }
            yield db_1.default.query('INSERT INTO "otpVerification_YN100" ("userId", "otp", "expirationTime") VALUES ($1, $2, $3)', [userId, otp, expirationTime]);
            console.log("otpService => addOtpDetails success");
        }
        catch (error) {
            console.log("Failed to add otp in db. Error in otpService => addOtpDetails: ", error);
            throw error;
        }
    }),
    verifyOTP: (userId, otp) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('inside verifyOTP in OTPService');
        try {
            const otpResult = yield db_1.default.query('SELECT "userId", "otp", "expirationTime" FROM "otpVerification_YN100" WHERE "otp" = $1', [otp]);
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
                yield db_1.default.query('DELETE FROM "otpVerification_YN100" WHERE "otp" = $1', [otp]);
                return true;
            }
            console.log('otp expired');
            yield db_1.default.query('DELETE FROM "otpVerification_YN100" WHERE "otp" = $1', [otp]);
            return false;
        }
        catch (error) {
            console.error('Error verifying OTP', error); // Changed LOG.error to console.error for safety
            return false;
        }
    }),
    clearExpiredOTPs: () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('inside clearExpiredOTPs in OTPService');
        const now = new Date();
        yield db_1.default.query('DELETE FROM "otpVerification_YN100" WHERE "expirationTime" < $1', [now]);
    })
};
