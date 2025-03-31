"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: process.env.AUTH_COGNITO_USER_POOL_ID,
    tokenUse: 'access',
    clientId: process.env.AUTH_COGNITO_CLIENT_ID
});
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, error: 'No token provided' });
        return;
    }
    try {
        const payload = yield verifier.verify(token);
        console.log("await verifier.verify(token) payload: ", payload);
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        // Handle specific verification errors
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                error: 'Token has expired'
            });
            return;
        }
        res.status(401).json({
            success: false,
            error: 'Invalid or unauthorized token'
        });
    }
});
exports.verifyToken = verifyToken;
