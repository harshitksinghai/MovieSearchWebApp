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
exports.checkAuthentication = exports.refreshToken = exports.logout = exports.changePasswordAndLogin = exports.register = exports.login = exports.clearExpiredOtps = exports.verifyOtp = exports.sendOtp = exports.verifyEmail = void 0;
// src/controllers/authController.ts
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authService_1 = require("../services/authService");
const otpService_1 = require("../services/otpService");
const emailService_1 = require("../services/emailService");
const jwtUtils_1 = require("../utils/jwtUtils");
const refreshTokenService_1 = require("../services/refreshTokenService");
const cookieUtils_1 = require("../utils/cookieUtils");
const authTypes_1 = require("../utils/authTypes");
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME;
const JWT_REFRESH_COOKIE_NAME = process.env.JWT_REFRESH_COOKIE_NAME;
const JWT_EXPIRATION_MS = parseInt(process.env.JWT_EXPIRATION_MS, 10);
exports.verifyEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("authController => verifyEmail => req.body: ", req.body);
    const { userId } = req.body;
    if (!userId) {
        console.log("!userId");
        res.status(400).json({
            status: false,
            message: "userId is required",
        });
        return;
    }
    const exists = yield authService_1.authService.userExistsByUserId(userId);
    if (!exists) {
        res.status(200).json({
            status: false,
            message: "User does not exist",
        });
        return;
    }
    res.status(200).json({
        status: true,
        message: "User exists",
    });
}));
exports.sendOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const otp = otpService_1.otpService.generateOTP();
        yield otpService_1.otpService.addOtpDetails(userId, otp);
        yield emailService_1.emailService.sendOtpEmail(userId, otp);
        res.status(200).json({
            status: true,
            message: "OTP sent successfully to your userId",
        });
    }
    catch (error) {
        console.log("Error in sendOtp:", error);
        res.status(500).json({
            status: false,
            message: "Failed to send OTP",
        });
    }
}));
exports.verifyOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        res.status(400);
        throw new Error("Email and OTP are required");
    }
    try {
        const isValid = yield otpService_1.otpService.verifyOTP(userId, otp);
        if (isValid) {
            res.status(200).json({
                status: true,
                message: "OTP verified successfully",
            });
        }
        else {
            res.status(400).json({
                status: false,
                message: "Invalid or expired OTP",
            });
        }
    }
    catch (error) {
        console.log("Error in verifyOtp:", error);
        res.status(500).json({
            status: false,
            message: "Failed to verify OTP",
        });
    }
}));
exports.clearExpiredOtps = (0, express_async_handler_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        otpService_1.otpService.clearExpiredOTPs();
    }
    catch (error) {
        console.log("unable to clear expired otps");
    }
}));
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, password } = req.body;
        // Authenticate user
        const user = yield authService_1.authService.authenticateUser(userId, password);
        if (!user) {
            res.status(404).json({
                status: false,
                message: "Authentication failed",
            });
            return;
        }
        if (!user.role) {
            res.status(500).json({
                status: false,
                message: "User is not assigned any role.",
            });
            return;
        }
        const jwtToken = jwtUtils_1.jwtUtils.generateToken(userId, user.role);
        const refreshToken = yield refreshTokenService_1.refreshTokenService.createRefreshToken(userId);
        const refreshTokenExpiryMs = yield refreshTokenService_1.refreshTokenService.getJwtRefreshExpirationMs(refreshToken.token);
        cookieUtils_1.cookieUtils.addCookie(res, JWT_COOKIE_NAME, jwtToken, JWT_EXPIRATION_MS);
        cookieUtils_1.cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, refreshToken.token, refreshTokenExpiryMs);
        authService_1.authService.updateRefreshTokenInUser(refreshToken.id, userId);
        res.status(200).json({
            status: true,
            message: "User logged in successfully!",
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: false,
            message: "Failed to login",
        });
    }
}));
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, password } = req.body;
        const role = (authTypes_1.Role.USER).toString();
        const jwtToken = jwtUtils_1.jwtUtils.generateToken(userId, role);
        yield authService_1.authService.registerUser(userId, password, role);
        const refreshToken = yield refreshTokenService_1.refreshTokenService.createRefreshToken(userId);
        const refreshTokenExpiryMs = yield refreshTokenService_1.refreshTokenService.getJwtRefreshExpirationMs(refreshToken.token);
        cookieUtils_1.cookieUtils.addCookie(res, JWT_COOKIE_NAME, jwtToken, JWT_EXPIRATION_MS);
        cookieUtils_1.cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, refreshToken.token, refreshTokenExpiryMs);
        yield authService_1.authService.updateRefreshTokenInUser(refreshToken.id, userId);
        res.status(200).json({
            status: true,
            message: "User registered successfully!",
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: false,
            message: "Failed to register",
        });
    }
}));
exports.changePasswordAndLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, password } = req.body;
        const role = authTypes_1.Role.USER;
        const jwtToken = jwtUtils_1.jwtUtils.generateToken(userId, role);
        const refreshToken = yield refreshTokenService_1.refreshTokenService.createRefreshToken(userId);
        const refreshTokenExpiryMs = yield refreshTokenService_1.refreshTokenService.getJwtRefreshExpirationMs(refreshToken.token);
        cookieUtils_1.cookieUtils.addCookie(res, JWT_COOKIE_NAME, jwtToken, JWT_EXPIRATION_MS);
        cookieUtils_1.cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, refreshToken.token, refreshTokenExpiryMs);
        authService_1.authService.updatePasswordAndRefreshToken(userId, password, refreshToken.id);
        res.status(200).json({
            status: true,
            message: "User logged in successfully!",
        });
    }
    catch (error) {
        console.error('Change password and login error:', error);
        res.status(500).json({
            status: false,
            message: "Failed to change password and login",
        });
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = cookieUtils_1.cookieUtils.getCookie(req, JWT_REFRESH_COOKIE_NAME);
        if (refreshToken) {
            const storedToken = yield refreshTokenService_1.refreshTokenService.findByToken(refreshToken);
            if (storedToken) {
                yield authService_1.authService.updateRefreshTokenInUser(null, storedToken.userId);
                yield refreshTokenService_1.refreshTokenService.deleteByToken(refreshToken);
            }
        }
        cookieUtils_1.cookieUtils.deleteCookie(res, JWT_COOKIE_NAME);
        cookieUtils_1.cookieUtils.deleteCookie(res, JWT_REFRESH_COOKIE_NAME);
        res.status(200).json({ status: true, message: "Successfully logged out" });
    }
    catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}));
exports.refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = cookieUtils_1.cookieUtils.getCookie(req, JWT_REFRESH_COOKIE_NAME);
    if (!refreshToken) {
        res.status(400).json({ status: false, message: "Refresh token not found in cookies." });
        return;
    }
    const tokenRecord = yield refreshTokenService_1.refreshTokenService.findByToken(refreshToken);
    if (!tokenRecord) {
        res.status(400).json({ status: false, message: "Invalid refresh token." });
        return;
    }
    const updatedToken = yield refreshTokenService_1.refreshTokenService.verifyExpiration(tokenRecord);
    if (!updatedToken) {
        res.status(400).json({ status: false, message: "Refresh token expired and deleted." });
        return;
    }
    const userId = updatedToken.userId;
    const userAuthDetails = yield authService_1.authService.fetchUserAuthDetailsByUserId(userId);
    if (!userAuthDetails) {
        res.status(500).json({ status: false, message: "Unable to fetch user details from db" });
        return;
    }
    const role = userAuthDetails.role;
    const accessToken = jwtUtils_1.jwtUtils.generateToken(userId, role);
    const refreshTokenExpiryMs = yield refreshTokenService_1.refreshTokenService.getJwtRefreshExpirationMs(refreshToken);
    cookieUtils_1.cookieUtils.addCookie(res, JWT_COOKIE_NAME, accessToken, JWT_EXPIRATION_MS);
    cookieUtils_1.cookieUtils.addCookie(res, JWT_REFRESH_COOKIE_NAME, updatedToken.token, refreshTokenExpiryMs);
    res.status(200).json({ status: true, message: "Tokens refreshed successfully." });
}));
exports.checkAuthentication = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = cookieUtils_1.cookieUtils.getCookie(req, JWT_COOKIE_NAME);
    if (!token || !jwtUtils_1.jwtUtils.validateToken(token)) {
        res.status(401).json({ status: false, message: "Not authenticated" });
        return;
    }
    try {
        const userId = jwtUtils_1.jwtUtils.getUsernameFromToken(token);
        res.status(200).json({ status: true, message: "Authenticated", util: userId });
    }
    catch (err) {
        console.error("JWT parse error:", err);
        res.status(401).json({ status: false, message: "Invalid token" });
    }
}));
