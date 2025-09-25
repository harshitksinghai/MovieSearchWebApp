import secureApiLocal from '@/app/api/axiosSecureLocal.ts';
import {
    LoginRequest,
    RegisterRequest,
    VerifyOtpRequest,
    ChangePasswordAndLoginRequest
} from '../utils/authTypes.ts';
import { CommonResponse } from '@/utils/commonTypes';


export const authApi = {
    verifyEmail: (userId: string) =>
        secureApiLocal.post<CommonResponse>(`/auth/verify-email`,{ userId }),

    login: (data: LoginRequest) =>
        secureApiLocal.post<CommonResponse>(`/auth/login`, data),

    sendOtp: (userId: string) =>
        secureApiLocal.post<CommonResponse>(`/auth/send-otp`, { userId }),

    verifyOtp: (data: VerifyOtpRequest) =>
        secureApiLocal.post<CommonResponse>(`/auth/verify-otp`, data),

    register: (data: RegisterRequest) =>
        secureApiLocal.post<CommonResponse>(`/auth/register`, data),

    changePasswordAndLogin: (data: ChangePasswordAndLoginRequest) =>
        secureApiLocal.post<CommonResponse>(`/auth/change-password-and-login`, data),

    logout: () =>
        secureApiLocal.post<CommonResponse>(`/auth/logout`),

    refreshAccessToken: () =>
        secureApiLocal.post('/auth/refresh-token', null),

    checkAuthentication: () =>
        secureApiLocal.get<CommonResponse>(`/auth/check-authentication`),

}