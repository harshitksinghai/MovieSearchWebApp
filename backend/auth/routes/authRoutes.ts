import express from "express";
import { decryptRequest } from "../../middlewares/dataInTransitEncryption";
import { encryptResponseForRoute } from "../../middlewares/encryptResponseForRoute";
import { changePasswordAndLogin, checkAuthentication, login, logout, register, sendOtp, verifyEmail, verifyOtp } from "../controllers/authController";
import { verifyToken } from "../../middlewares/authToken";

const router = express.Router();

router.post('/verify-email', decryptRequest, encryptResponseForRoute, verifyEmail);
router.post('/send-otp', decryptRequest, encryptResponseForRoute, sendOtp);
router.post('/verify-otp', decryptRequest, encryptResponseForRoute, verifyOtp);
router.get('/clear-expired-otps', verifyOtp);
router.post('/register', decryptRequest, encryptResponseForRoute, register);
router.post('/login', decryptRequest, encryptResponseForRoute, login);
router.post('/change-password-and-login', decryptRequest, encryptResponseForRoute, changePasswordAndLogin);
router.get('/check-authentication', verifyToken, decryptRequest, encryptResponseForRoute, checkAuthentication);
router.post('/logout', verifyToken, decryptRequest, encryptResponseForRoute, logout);



export default router;