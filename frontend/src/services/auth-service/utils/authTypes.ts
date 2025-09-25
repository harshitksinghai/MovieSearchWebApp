export type AuthMode = 'verify-email' | 'otp' | 'login-password' | 'reset-password' | 'register';
export type OtpMode = 'reset-password' | 'register';
export type Mode = 'register' | 'login';

export interface LoginRequest {
    userId: string;
    password: string;
  }
  
  export interface RegisterRequest {
    userId: string;
    password: string;
  }
  
  export interface VerifyOtpRequest {
    userId: string;
    otp: string;
  }
  
  export interface OnboardRequest {
    firstName: string;
    middleName?: string;
    lastName: string;
  }
  
  export interface ChangePasswordAndLoginRequest {
    userId: string;
    password: string;
  }