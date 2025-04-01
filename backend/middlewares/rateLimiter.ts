import rateLimit from "express-rate-limit";

export const updateProfileRateLimiter = rateLimit({
  windowMs: 1 * 10 * 1000, // 10 sec
  limit: 2, // Only 2 requests per window
  message: "Too many profile update attempts. Please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const searchRateLimiter = rateLimit({
  windowMs: 1 * 3 * 1000, // 3 sec
  limit: 2, // 2 requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many search requests. Please slow down.",
});

export const actionButtonLimiter = rateLimit({
  windowMs: 1 * 3 * 1000, // 3 sec
  limit: 2, // 2 requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many rating update requests. Please slow down.",
});
