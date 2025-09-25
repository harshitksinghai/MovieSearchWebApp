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
exports.emailService = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.OTP_RESEND_API_KEY);
exports.emailService = {
    sendOtpEmail: (userId, otp) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("inside emailService => sendOtpEmail");
        try {
            yield resend.emails.send({
                from: "onboarding@resend.dev",
                to: userId,
                subject: 'MovieKeeper App Verification Code',
                text: `Your verification code is: ${otp}\nThis code will expire in 5 minutes.\nIf you didn't request this, ignore this email.`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `,
            });
            console.log("emailService => sendOtpEmail success");
        }
        catch (error) {
            console.log("Failed to send OTP via Resend: ", error);
            throw error;
        }
    }),
};
