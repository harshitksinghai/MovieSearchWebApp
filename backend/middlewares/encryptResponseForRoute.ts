import { Request, Response, NextFunction } from 'express';
import { encryptResponse } from './dataInTransitEncryption';

export const encryptResponseForRoute = (_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    try {
        console.log("data to encrypt in response: ", data);
      const { encryptedData, encryptedAesKey } = encryptResponse(data);
    
      res.set('X-Encrypted-Key', encryptedAesKey);
      console.log("set aes key in response header: ", encryptedAesKey);
    //   console.log("encryptResponseForRoute middleware => response: ", originalJson.call(this, { encryptedData }))
      return originalJson.call(this, { encryptedData });
    } catch (error) {
      console.error('Response encryption error:', error);
      return originalJson.call(this, { error: 'Failed to encrypt response' });
    }
  };
  
  next();
};