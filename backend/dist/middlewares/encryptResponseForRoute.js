"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptResponseForRoute = void 0;
const dataInTransitEncryption_1 = require("./dataInTransitEncryption");
const encryptResponseForRoute = (_req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        try {
            console.log("data to encrypt in response: ", data);
            const { encryptedData, encryptedAesKey } = (0, dataInTransitEncryption_1.encryptResponse)(data);
            res.set('X-Encrypted-Key', encryptedAesKey);
            console.log("set aes key in response header: ", encryptedAesKey);
            //   console.log("encryptResponseForRoute middleware => response: ", originalJson.call(this, { encryptedData }))
            return originalJson.call(this, { encryptedData });
        }
        catch (error) {
            console.error('Response encryption error:', error);
            return originalJson.call(this, { error: 'Failed to encrypt response' });
        }
    };
    next();
};
exports.encryptResponseForRoute = encryptResponseForRoute;
