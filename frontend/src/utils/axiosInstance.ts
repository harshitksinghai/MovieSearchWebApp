import axios from "axios";
import { User } from "oidc-client-ts";

const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;
const AUTH_COGNITO_AUTHORITY = import.meta.env.VITE_AUTH_COGNITO_AUTHORITY;
const AUTH_COGNITO_CLIENT_ID = import.meta.env.VITE_AUTH_COGNITO_CLIENT_ID;

function getUser() {
  const storageKey = `oidc.user:${AUTH_COGNITO_AUTHORITY}:${AUTH_COGNITO_CLIENT_ID}`;
  const oidcStorage = localStorage.getItem(storageKey);
  
  if (!oidcStorage) {
    return null;
  }
  
  try {
    const user = User.fromStorageString(oidcStorage);
    
    // Additional token validation checks
    if (!user || !user.access_token) {
      return null;
    }
    
    // Check if token is expired
    if (user.expired) {
      console.warn('Access token has expired');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
}

export const authAxios = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
authAxios.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user?.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const publicAxios = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
