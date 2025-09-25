import { Request, Response, NextFunction } from "express";
import { jwtUtils } from "../auth/utils/jwtUtils";
import { cookieUtils } from "../auth/utils/cookieUtils";
import dotenv from "dotenv";

dotenv.config();

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME!;

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = cookieUtils.getCookie(req, JWT_COOKIE_NAME);

  if (!token || !jwtUtils.validateToken(token)) {
    res.status(401).json({ status: false, message: "Unauthorized: Invalid or missing token" });
    return;
  }

  try {
    const email = jwtUtils.getUsernameFromToken(token);
    const role = jwtUtils.getRoleFromToken(token);

    req.user = { email, role };

    next();
  } catch (err) {
    console.error("JWT decode error:", err);
    res.status(401).json({ status: false, message: "Unauthorized: Token verification failed" });
  }
};
