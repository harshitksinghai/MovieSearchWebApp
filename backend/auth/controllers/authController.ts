// src/controllers/authController.ts
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { authService } from "../services/authService";
import { otpService } from "../services/otpService";
import { emailService } from "../services/emailService";
import { CommonResponse } from "../../types/commonTypes";
import { jwtUtils } from "../utils/jwtUtils";
import { refreshTokenService } from "../services/refreshTokenService";
import { cookieUtils } from "../utils/cookieUtils";
import { Role } from "../utils/authTypes";

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME!;
const JWT_REFRESH_COOKIE_NAME = process.env.JWT_REFRESH_COOKIE_NAME!;
const JWT_EXPIRATION_MS = parseInt(process.env.JWT_EXPIRATION_MS!, 10);

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  console.log("authController => verifyEmail => req.body: ", req.body);
  const { userId } = req.body;

  if (!userId) {
    console.log("!userId")
    res.status(400).json({
      status: false,
      message: "userId is required",
    });
    return;
  }

  const exists = await authService.userExistsByUserId(userId);

  if (!exists) {
    res.status(200).json({
      status: false,
      message: "User does not exist",
    } as CommonResponse);
    return;
  }

  res.status(200).json({
    status: true,
    message: "User exists",
  } as CommonResponse);
});

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({
      status: false,
      message: "userId is required",
    });
    return;
  }

  try {
    // const user = await authService.userExistsByUserId(userId);

    // if (!user) {
    //   res.status(404).json({
    //     status: false,
    //     message: "User not found with this userId",
    //   } as CommonResponse);
    //   return;
    // }

    const otp = otpService.generateOTP();
    await otpService.addOtpDetails(userId, otp);
    await emailService.sendOtpEmail(userId, otp);

    res.status(200).json({
      status: true,
      message: "OTP sent successfully to your userId",
    } as CommonResponse);
  } catch (error) {
    console.log("Error in sendOtp:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send OTP",
    } as CommonResponse);
  }
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  try {
    const isValid = await otpService.verifyOTP(userId, otp);

    if (isValid) {
      res.status(200).json({
        status: true,
        message: "OTP verified successfully",
      } as CommonResponse);
    } else {
      res.status(400).json({
        status: false,
        message: "Invalid or expired OTP",
      } as CommonResponse);
    }
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.status(500).json({
      status: false,
      message: "Failed to verify OTP",
    } as CommonResponse);
  }
});

export const clearExpiredOtps = asyncHandler(
  async () => {
    try{
      otpService.clearExpiredOTPs();
    } catch (error) {
      console.log("unable to clear expired otps");
    }
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {userId, password} = req.body;
    
    // Authenticate user
    const user = await authService.authenticateUser(userId, password);
    
    if (!user) {
      res.status(404).json({
        status: false,
        message: "Authentication failed",
      } as CommonResponse);
      return;
    }
    if(!user.role){
      res.status(500).json({
        status: false,
        message: "User is not assigned any role.",
      } as CommonResponse);
      return;
    }
 
    const jwtToken = jwtUtils.generateToken(userId, user.role);
    
    const refreshToken = await refreshTokenService.createRefreshToken(userId);
    const refreshTokenExpiryMs = await refreshTokenService.getJwtRefreshExpirationMs(refreshToken.token);
    
    cookieUtils.addCookie(res, JWT_COOKIE_NAME, jwtToken, JWT_EXPIRATION_MS);
    cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, refreshToken.token, refreshTokenExpiryMs);
    
    authService.updateRefreshTokenInUser(refreshToken.id, userId);
    
    res.status(200).json({
      status: true,
      message: "User logged in successfully!",
    } as CommonResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to login",
    } as CommonResponse);
  }
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {userId, password} = req.body;
    
    const role = (Role.USER).toString();
    const jwtToken = jwtUtils.generateToken(userId, role);

    await authService.registerUser(userId, password, role);
    
    const refreshToken = await refreshTokenService.createRefreshToken(userId);

    const refreshTokenExpiryMs = await refreshTokenService.getJwtRefreshExpirationMs(refreshToken.token);
    
    cookieUtils.addCookie(res, JWT_COOKIE_NAME, jwtToken, JWT_EXPIRATION_MS);
    cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, refreshToken.token, refreshTokenExpiryMs);
    
    await authService.updateRefreshTokenInUser(refreshToken.id, userId);

    res.status(200).json({
      status: true,
      message: "User registered successfully!",
    } as CommonResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to register",
    } as CommonResponse);
  }
});

export const changePasswordAndLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {userId, password} = req.body;
    
    const role = Role.USER;

    const jwtToken = jwtUtils.generateToken(userId, role);
    
    const refreshToken = await refreshTokenService.createRefreshToken(userId);

    const refreshTokenExpiryMs = await refreshTokenService.getJwtRefreshExpirationMs(refreshToken.token);
    
    cookieUtils.addCookie(res, JWT_COOKIE_NAME, jwtToken, JWT_EXPIRATION_MS);
    cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, refreshToken.token, refreshTokenExpiryMs);
    
    authService.updatePasswordAndRefreshToken(userId, password, refreshToken.id);
    
    res.status(200).json({
      status: true,
      message: "User logged in successfully!",
    } as CommonResponse);
  } catch (error) {
    console.error('Change password and login error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to change password and login",
    } as CommonResponse);
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    const refreshToken = cookieUtils.getCookie(req, JWT_REFRESH_COOKIE_NAME);

    if (refreshToken) {
      const storedToken = await refreshTokenService.findByToken(refreshToken);

      if (storedToken) {
        await authService.updateRefreshTokenInUser(null, storedToken.userId);
        await refreshTokenService.deleteByToken(refreshToken);
      }
    }

    cookieUtils.deleteCookie(res, JWT_COOKIE_NAME);
    cookieUtils.deleteCookie(res, JWT_REFRESH_COOKIE_NAME);

    res.status(200).json({ status: true, message: "Successfully logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = cookieUtils.getCookie(req, JWT_REFRESH_COOKIE_NAME);

  if (!refreshToken) {
    res.status(400).json({ status: false, message: "Refresh token not found in cookies." });
    return;
  }

  const tokenRecord = await refreshTokenService.findByToken(refreshToken);
  if (!tokenRecord) {
    res.status(400).json({ status: false, message: "Invalid refresh token." });
    return;
  }

  const updatedToken = await refreshTokenService.verifyExpiration(tokenRecord);
  if (!updatedToken) {
    res.status(400).json({ status: false, message: "Refresh token expired and deleted." });
    return;
  }

  const userId = updatedToken.userId;
  const userAuthDetails = await authService.fetchUserAuthDetailsByUserId(userId);
  if(!userAuthDetails){
    res.status(500).json({ status: false, message: "Unable to fetch user details from db" });
    return;
  }
  const role = userAuthDetails.role;

  const accessToken = jwtUtils.generateToken(userId, role);
  const refreshTokenExpiryMs = await refreshTokenService.getJwtRefreshExpirationMs(refreshToken);

  cookieUtils.addCookie(res, JWT_COOKIE_NAME, accessToken, JWT_EXPIRATION_MS);
  cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, updatedToken.token, refreshTokenExpiryMs);

  res.status(200).json({ status: true, message: "Tokens refreshed successfully." });
});

export const checkAuthentication = asyncHandler(async (req: Request, res: Response) => {
  const token = cookieUtils.getCookie(req, JWT_COOKIE_NAME);

  if (!token || !jwtUtils.validateToken(token)) {
    res.status(401).json({ status: false, message: "Not authenticated" });
    return;
  }

  try {
    const userId = jwtUtils.getUsernameFromToken(token);
    res.status(200).json({ status: true, message: "Authenticated", util: userId });
  } catch (err) {
    console.error("JWT parse error:", err);
    res.status(401).json({ status: false, message: "Invalid token" });
  }
});