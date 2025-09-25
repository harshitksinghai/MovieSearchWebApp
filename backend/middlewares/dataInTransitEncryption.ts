import forge from 'node-forge';
import dotenv from "dotenv";

dotenv.config();

const RSA_PRIVATE_KEY_BE = process.env.RSA_PRIVATE_KEY_BE!;
const RSA_PUBLIC_KEY_FE = process.env.RSA_PUBLIC_KEY_FE!;

const validateRsaKey = (key: string, keyType: string): void => {
  if (!key) {
    throw new Error(`Missing ${keyType} key in environment variables`);
  }
};

// Generate a random AES key (32 bytes = 256 bits)
export const generateAESKey = (): string => {
  return forge.util.bytesToHex(forge.random.getBytesSync(32));
};

// Decrypt AES key using RSA private key
export const decryptAESKey = (encryptedAesKey: string): string => {
  validateRsaKey(RSA_PRIVATE_KEY_BE, 'Backend RSA private');
  
  try {
    // Create RSA private key from PEM
    const privateKey = forge.pki.privateKeyFromPem(RSA_PRIVATE_KEY_BE);
    
    // Decode base64 encrypted key
    const encryptedBytes = forge.util.decode64(encryptedAesKey);
    
    // Decrypt the AES key
    const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
    
    // Return hex encoded key
    return forge.util.bytesToHex(decryptedBytes);
  } catch (error) {
    console.error('AES key decryption error:', error);
    throw error;
  }
};

// Encrypt AES key using RSA public key
export const encryptAESKey = (aesKey: string): string => {
  validateRsaKey(RSA_PUBLIC_KEY_FE, 'Frontend RSA public');

  try {
    // Convert hex key to bytes for RSA encryption
    const aesKeyBytes = forge.util.hexToBytes(aesKey);
    
    // Create RSA public key from PEM
    const publicKey = forge.pki.publicKeyFromPem(RSA_PUBLIC_KEY_FE);
    
    // Encrypt the AES key
    const encrypted = publicKey.encrypt(aesKeyBytes, 'RSAES-PKCS1-V1_5');
    
    // Return base64 encoded encrypted key
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error('AES key encryption error:', error);
    throw error;
  }
};

// Encrypt data using AES-256-CBC
export const encryptData = (data: any, aesKey: string): string => {
  try {
    const jsonString = JSON.stringify(data);
    
    // Convert hex key to bytes
    const keyBytes = forge.util.hexToBytes(aesKey);
    
    // Create fixed IV of zeros for compatibility
    const iv = forge.util.createBuffer(new Uint8Array(16));
    
    // Create cipher
    const cipher = forge.cipher.createCipher('AES-CBC', keyBytes);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(jsonString, 'utf8'));
    cipher.finish();
    
    // Return base64 encoded encrypted data
    return forge.util.encode64(cipher.output.getBytes());
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// Decrypt data using AES-256-CBC
export const decryptData = (encryptedData: string, aesKey: string): any => {
  try {
    // Convert hex key to bytes
    const keyBytes = forge.util.hexToBytes(aesKey);
    
    // Create fixed IV of zeros for compatibility
    const iv = forge.util.createBuffer(new Uint8Array(16));
    
    // Decode base64 encrypted data
    const encryptedBytes = forge.util.decode64(encryptedData);
    
    // Create decipher
    const decipher = forge.cipher.createDecipher('AES-CBC', keyBytes);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(encryptedBytes));
    const result = decipher.finish();
    
    if (!result) {
      throw new Error('Failed to decrypt data');
    }
    
    // Parse decrypted JSON string
    const decryptedString = decipher.output.toString(); ////'utf8'
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

// Middleware to decrypt incoming requests
export const decryptRequest = (req: any, res: any, next: any) => {
  try {
    if (req.body.encryptedData && req.headers['x-encrypted-key']) {
      const encryptedData = req.body.encryptedData;
      const encryptedAesKey = req.headers['x-encrypted-key'];
      
      const aesKey = decryptAESKey(encryptedAesKey);
      
      req.body = decryptData(encryptedData, aesKey);
      console.log("Success: decrypt Request: req.body: ", req.body);
    }
    
    next();
  } catch (error) {
    console.error('Decryption error in middleware:', error);
    return res.status(400).json({ error: 'Invalid encrypted data' });
  }
};

// Function to encrypt response data
export const encryptResponse = (data: any): { 
  encryptedData: string, 
  encryptedAesKey: string 
} => {
  try {
    // Generate a random 32-byte (256-bit) AES key
    const aesKey = generateAESKey();
    console.log('Generated AES key (BE):', aesKey);
    
    const encryptedData = encryptData(data, aesKey);
    const encryptedAesKey = encryptAESKey(aesKey);
    
    return {
      encryptedData,
      encryptedAesKey
    };
  } catch (error) {
    console.error('Error encrypting response:', error);
    throw error;
  }
};

