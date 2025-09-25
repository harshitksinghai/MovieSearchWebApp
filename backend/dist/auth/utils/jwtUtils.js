"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const jwtExpirationMs = parseInt(process.env.JWT_EXPIRATION_MS, 10);
exports.jwtUtils = {
    getSigningKey: () => {
        return Buffer.from(jwtSecret);
    },
    generateToken: (userId, role) => {
        return jsonwebtoken_1.default.sign({
            sub: userId,
            role: role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor((Date.now() + jwtExpirationMs) / 1000),
        }, exports.jwtUtils.getSigningKey(), { algorithm: "HS512" });
    },
    validateToken: (token) => {
        try {
            jsonwebtoken_1.default.verify(token, exports.jwtUtils.getSigningKey());
            return true;
        }
        catch (error) {
            return false;
        }
    },
    getUsernameFromToken: (token) => {
        const decoded = jsonwebtoken_1.default.verify(token, exports.jwtUtils.getSigningKey());
        return decoded.sub;
    },
    getRoleFromToken: (token) => {
        const decoded = jsonwebtoken_1.default.verify(token, exports.jwtUtils.getSigningKey());
        return decoded.role;
    },
};
