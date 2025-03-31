import forge from 'node-forge';

const RSA_PUBLIC_KEY_BE = import.meta.env.VITE_RSA_PUBLIC_KEY_BE!;
const RSA_PRIVATE_KEY_FE = import.meta.env.VITE_RSA_PRIVATE_KEY_FE!;

// Generate a random AES key (32 bytes = 256 bits)
const generateAESKey = (): string => {
  return forge.util.bytesToHex(forge.random.getBytesSync(32));
};

// Encrypt data using AES-256-CBC
const encryptData = (data: any, aesKey: string): string => {
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
const decryptData = (encryptedData: string, aesKey: string): any => {
    console.log("decryptData");
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
    const decryptedString = decipher.output.toString();
    console.log("decryptData success => decrypted data: ", decryptedString);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

// Encrypt AES key with RSA public key
const encryptAESKey = (aesKey: string): string => {
  try {
    // Convert hex key to bytes for RSA encryption
    const aesKeyBytes = forge.util.hexToBytes(aesKey);
    
    // Create RSA public key from PEM
    const publicKey = forge.pki.publicKeyFromPem(RSA_PUBLIC_KEY_BE);
    
    // Encrypt the AES key
    const encrypted = publicKey.encrypt(aesKeyBytes, 'RSAES-PKCS1-V1_5');
    
    // Return base64 encoded encrypted key
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error('AES key encryption error:', error);
    throw error;
  }
};

// Decrypt AES key with RSA private key
const decryptAESKey = (encryptedAesKey: string): string => {
  try {
    // Create RSA private key from PEM
    const privateKey = forge.pki.privateKeyFromPem(RSA_PRIVATE_KEY_FE);
    
    // Decode base64 encrypted key
    const encryptedBytes = forge.util.decode64(encryptedAesKey);
    
    // Decrypt the AES key
    const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
    
    // Return hex encoded key
    const decryptedAESKey = forge.util.bytesToHex(decryptedBytes);
    console.log("decryptedAESKey: ", decryptedAESKey);
    return decryptedAESKey;
  } catch (error) {
    console.error('AES key decryption error:', error);
    throw error;
  }
};

// Encrypt request data
export const encryptRequest = (data: any): { 
  encryptedData: string, 
  encryptedAesKey: string 
} => {
  try {
    const aesKey = generateAESKey();
    console.log('Generated AES key (FE):', aesKey);
    
    const encryptedData = encryptData(data, aesKey);
    const encryptedAesKey = encryptAESKey(aesKey);
    
    console.log('Encrypted data length (FE):', encryptedData.length);
    console.log('Encrypted AES key length (FE):', encryptedAesKey.length);
    
    return {
      encryptedData,
      encryptedAesKey
    };
  } catch (error) {
    console.error('Encryption request error:', error);
    throw error;
  }
};

// Decrypt response data
export const decryptResponse = (
  encryptedData: string, 
  encryptedAesKey: string
): any => {
  try {
    const aesKey = decryptAESKey(encryptedAesKey);
    console.log('Decrypted AES key (FE):', aesKey);
    
    const decryptedData = decryptData(encryptedData, aesKey);
    return decryptedData;
  } catch (error) {
    console.error('Decryption response error:', error);
    throw error;
  }
};