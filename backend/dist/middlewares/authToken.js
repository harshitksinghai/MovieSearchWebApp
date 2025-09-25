"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwtUtils_1 = require("../auth/utils/jwtUtils");
const cookieUtils_1 = require("../auth/utils/cookieUtils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME;
const verifyToken = (req, res, next) => {
    const token = cookieUtils_1.cookieUtils.getCookie(req, JWT_COOKIE_NAME);
    if (!token || !jwtUtils_1.jwtUtils.validateToken(token)) {
        res.status(401).json({ status: false, message: "Unauthorized: Invalid or missing token" });
        return;
    }
    try {
        const email = jwtUtils_1.jwtUtils.getUsernameFromToken(token);
        const role = jwtUtils_1.jwtUtils.getRoleFromToken(token);
        req.user = { email, role };
        next();
    }
    catch (err) {
        console.error("JWT decode error:", err);
        res.status(401).json({ status: false, message: "Unauthorized: Token verification failed" });
    }
};
exports.verifyToken = verifyToken;
