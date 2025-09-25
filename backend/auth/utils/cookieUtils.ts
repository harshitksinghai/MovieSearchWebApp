import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const MODE = process.env.MODE;

export const cookieUtils = {
  addCookie: (res: Response, name: string, value: string, maxAge: number): void => {
    res.cookie(name, value, {
      httpOnly: true,
      secure: MODE === "production",
      sameSite: "strict",
      maxAge: maxAge,
      path: "/",
    });
  },

  deleteCookie: (res: Response, name: string): void => {
    res.clearCookie(name, {
      httpOnly: true,
      secure: MODE === "production",
      sameSite: "strict",
      path: "/",
    });
  },

  getCookie: (req: Request, cookieName: string): string | null => {
    return req.cookies?.[cookieName] ?? null;
  },
};
