import axios from "axios";
import { authApi } from '@/services/auth-service/api/authApi.ts';
import { decryptResponse, encryptRequest } from "@/services/auth-service/utils/dataInTransitEncryption";

const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

const secureApiLocal = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true, // Automatically send cookies
    headers: {
      'Content-Type': 'application/json',
    },
});

secureApiLocal.interceptors.request.use(
  (request) => {
      console.log("secureApiLocal.interceptors.request: request.data: ", request.data)
    if (request.data) {
      const { encryptedData, encryptedAesKey } = encryptRequest(request.data);
      request.data = { encryptedData };
      request.headers['x-encrypted-key'] = encryptedAesKey;
    }
    
    return request;
  },
  (error) => Promise.reject(error)
);

secureApiLocal.interceptors.response.use(
    (response) => {
        if (response.data?.encryptedData && response.headers['x-encrypted-key']) {
          const encryptedData = response.data.encryptedData;
          const encryptedAesKey = response.headers['x-encrypted-key'];
    
          response.data = decryptResponse(encryptedData, encryptedAesKey);
        }
      console.log("secureApiLocal.interceptors.response: response.data: ", response.data)
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

                return secureApiLocal(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error("Token refresh failed. Logging out...");
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default secureApiLocal;