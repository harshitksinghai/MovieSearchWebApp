"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionButtonLimiter = exports.searchRateLimiter = exports.updateProfileRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.updateProfileRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 20 * 1000, // 15 minutes
    limit: 2, // Only 5 requests per window
    message: "Too many profile update attempts. Please try again later.",
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
exports.searchRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 10 * 1000, // 15 minutes
    limit: 2, // 100 requests per window
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many search requests. Please slow down.",
});
exports.actionButtonLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 10 * 1000, // 15 minutes
    limit: 2, // 100 requests per window
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many rating update requests. Please slow down.",
});
