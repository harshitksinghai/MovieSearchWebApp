import rateLimit from "express-rate-limit";

export const updateProfileRateLimiter = rateLimit({
  windowMs: 1 * 20 * 1000, // 15 minutes
  limit: 2, // Only 5 requests per window
  message: "Too many profile update attempts. Please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const searchRateLimiter = rateLimit({
  windowMs: 1 * 10 * 1000, // 15 minutes
  limit: 2, // 100 requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many search requests. Please slow down.",
});

export const actionButtonLimiter = rateLimit({
  windowMs: 1 * 10 * 1000, // 15 minutes
  limit: 2, // 100 requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many rating update requests. Please slow down.",
});
