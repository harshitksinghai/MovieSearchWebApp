"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptResponse = exports.decryptRequest = exports.decryptData = exports.encryptData = exports.encryptAESKey = exports.decryptAESKey = exports.generateAESKey = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RSA_PRIVATE_KEY_BE = process.env.RSA_PRIVATE_KEY_BE;
const RSA_PUBLIC_KEY_FE = process.env.RSA_PUBLIC_KEY_FE;
const validateRsaKey = (key, keyType) => {
    if (!key) {
        throw new Error(`Missing ${keyType} key in environment variables`);
    }
};
// Generate a random AES key (32 bytes = 256 bits)
const generateAESKey = () => {
    return node_forge_1.default.util.bytesToHex(node_forge_1.default.random.getBytesSync(32));
};
exports.generateAESKey = generateAESKey;
// Decrypt AES key using RSA private key
const decryptAESKey = (encryptedAesKey) => {
    validateRsaKey(RSA_PRIVATE_KEY_BE, 'Backend RSA private');
    try {
        // Create RSA private key from PEM
        const privateKey = node_forge_1.default.pki.privateKeyFromPem(RSA_PRIVATE_KEY_BE);
        // Decode base64 encrypted key
        const encryptedBytes = node_forge_1.default.util.decode64(encryptedAesKey);
        // Decrypt the AES key
        const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
        // Return hex encoded key
        return node_forge_1.default.util.bytesToHex(decryptedBytes);
    }
    catch (error) {
        console.error('AES key decryption error:', error);
        throw error;
    }
};
exports.decryptAESKey = decryptAESKey;
// Encrypt AES key using RSA public key
const encryptAESKey = (aesKey) => {
    validateRsaKey(RSA_PUBLIC_KEY_FE, 'Frontend RSA public');
    try {
        // Convert hex key to bytes for RSA encryption
        const aesKeyBytes = node_forge_1.default.util.hexToBytes(aesKey);
        // Create RSA public key from PEM
        const publicKey = node_forge_1.default.pki.publicKeyFromPem(RSA_PUBLIC_KEY_FE);
        // Encrypt the AES key
        const encrypted = publicKey.encrypt(aesKeyBytes, 'RSAES-PKCS1-V1_5');
        // Return base64 encoded encrypted key
        return node_forge_1.default.util.encode64(encrypted);
    }
    catch (error) {
        console.error('AES key encryption error:', error);
        throw error;
    }
};
exports.encryptAESKey = encryptAESKey;
// Encrypt data using AES-256-CBC
const encryptData = (data, aesKey) => {
    try {
        const jsonString = JSON.stringify(data);
        // Convert hex key to bytes
        const keyBytes = node_forge_1.default.util.hexToBytes(aesKey);
        // Create fixed IV of zeros for compatibility
        const iv = node_forge_1.default.util.createBuffer(new Uint8Array(16));
        // Create cipher
        const cipher = node_forge_1.default.cipher.createCipher('AES-CBC', keyBytes);
        cipher.start({ iv: iv });
        cipher.update(node_forge_1.default.util.createBuffer(jsonString, 'utf8'));
        cipher.finish();
        // Return base64 encoded encrypted data
        return node_forge_1.default.util.encode64(cipher.output.getBytes());
    }
    catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};
exports.encryptData = encryptData;
// Decrypt data using AES-256-CBC
const decryptData = (encryptedData, aesKey) => {
    try {
        // Convert hex key to bytes
        const keyBytes = node_forge_1.default.util.hexToBytes(aesKey);
        // Create fixed IV of zeros for compatibility
        const iv = node_forge_1.default.util.createBuffer(new Uint8Array(16));
        // Decode base64 encrypted data
        const encryptedBytes = node_forge_1.default.util.decode64(encryptedData);
        // Create decipher
        const decipher = node_forge_1.default.cipher.createDecipher('AES-CBC', keyBytes);
        decipher.start({ iv: iv });
        decipher.update(node_forge_1.default.util.createBuffer(encryptedBytes));
        const result = decipher.finish();
        if (!result) {
            throw new Error('Failed to decrypt data');
        }
        // Parse decrypted JSON string
        const decryptedString = decipher.output.toString(); ////'utf8'
        return JSON.parse(decryptedString);
    }
    catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};
exports.decryptData = decryptData;
// Middleware to decrypt incoming requests
const decryptRequest = (req, res, next) => {
    try {
        if (req.body.encryptedData && req.headers['x-encrypted-key']) {
            const encryptedData = req.body.encryptedData;
            const encryptedAesKey = req.headers['x-encrypted-key'];
            const aesKey = (0, exports.decryptAESKey)(encryptedAesKey);
            req.body = (0, exports.decryptData)(encryptedData, aesKey);
        }
        next();
    }
    catch (error) {
        console.error('Decryption error in middleware:', error);
        return res.status(400).json({ error: 'Invalid encrypted data' });
    }
};
exports.decryptRequest = decryptRequest;
// Function to encrypt response data
const encryptResponse = (data) => {
    try {
        // Generate a random 32-byte (256-bit) AES key
        const aesKey = (0, exports.generateAESKey)();
        console.log('Generated AES key (BE):', aesKey);
        const encryptedData = (0, exports.encryptData)(data, aesKey);
        const encryptedAesKey = (0, exports.encryptAESKey)(aesKey);
        return {
            encryptedData,
            encryptedAesKey
        };
    }
    catch (error) {
        console.error('Error encrypting response:', error);
        throw error;
    }
};
exports.encryptResponse = encryptResponse;
