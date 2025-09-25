import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.OTP_RESEND_API_KEY);

export const emailService = {
  sendOtpEmail: async (userId: string, otp: string): Promise<void> => {
    console.log("inside emailService => sendOtpEmail");

    try {
      await resend.emails.send({
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
    } catch (error) {
      console.log("Failed to send OTP via Resend: ", error);
      throw error;
    }
  },
};
