import axios from "axios";
import { authApi } from '@/services/auth-service/api/authApi.ts';

const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

const apiLocal = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiLocal.interceptors.response.use(
    (response) => {
        return response;
      },
    async (error) => {
        const originalRequest = error.request;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop
            try {
                // Trigger token refresh
                console.log("calling: authApi.refreshAccessToken()");
                await authApi.refreshAccessToken();
                console.log("worked: authApi.refreshAccessToken()");

                return apiLocal(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error("Token refresh failed. Logging out...");
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiLocal;