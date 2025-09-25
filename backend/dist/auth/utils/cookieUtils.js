"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieUtils = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MODE = process.env.MODE;
exports.cookieUtils = {
    addCookie: (res, name, value, maxAge) => {
        res.cookie(name, value, {
            httpOnly: true,
            secure: MODE === "production",
            sameSite: "strict",
            maxAge: maxAge,
            path: "/",
        });
    },
    deleteCookie: (res, name) => {
        res.clearCookie(name, {
            httpOnly: true,
            secure: MODE === "production",
            sameSite: "strict",
            path: "/",
        });
    },
    getCookie: (req, cookieName) => {
        var _a, _b;
        return (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[cookieName]) !== null && _b !== void 0 ? _b : null;
    },
};
