import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AUTH_COGNITO_USER_POOL_ID!,
    tokenUse: 'access',
    clientId: process.env.AUTH_COGNITO_CLIENT_ID!
  });
  
  // Simple token verification middleware
  export const verifyToken = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }
  
    try {
      const payload = await verifier.verify(token);
        console.log("await verifier.verify(token) payload: ", payload)
      next();
    } catch (error: any) {
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
  };