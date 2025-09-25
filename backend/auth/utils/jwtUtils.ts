import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;
const jwtExpirationMs = parseInt(process.env.JWT_EXPIRATION_MS!, 10);

export const jwtUtils = {
  getSigningKey: (): Buffer => {
    return Buffer.from(jwtSecret);
  },
  generateToken: (userId: string, role: string): string => {
    return jwt.sign(
      {
        sub: userId,
        role: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + jwtExpirationMs) / 1000),
      },
      jwtUtils.getSigningKey(),
      { algorithm: "HS512" }
    );
  },

  validateToken: (token: string): boolean => {
    try {
      jwt.verify(token, jwtUtils.getSigningKey());
      return true;
    } catch (error) {
      return false;
    }
  },
  getUsernameFromToken: (token: string): string => {
    const decoded = jwt.verify(
      token,
      jwtUtils.getSigningKey()
    ) as jwt.JwtPayload;
    return decoded.sub as string;
  },
  getRoleFromToken: (token: string): string => {
    const decoded = jwt.verify(
      token,
      jwtUtils.getSigningKey()
    ) as jwt.JwtPayload;
    return decoded.role as string;
  },
};
