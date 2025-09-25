// import axios from "axios";
// import { User } from "oidc-client-ts";
// import { encryptRequest, decryptResponse } from "@/services/auth-service/utils/dataInTransitEncryption.ts";

// const MODE = import.meta.env.MODE || "development";
// const BACKEND_URL =
//   MODE === "production"
//     ? import.meta.env.VITE_BACKEND_URL_PROD
//     : import.meta.env.VITE_BACKEND_URL_DEV;
    
// const AUTH_COGNITO_AUTHORITY = import.meta.env.VITE_AUTH_COGNITO_AUTHORITY;
// const AUTH_COGNITO_CLIENT_ID = import.meta.env.VITE_AUTH_COGNITO_CLIENT_ID;

// function getUser() {
//   const storageKey = `oidc.user:${AUTH_COGNITO_AUTHORITY}:${AUTH_COGNITO_CLIENT_ID}`;
//   const oidcStorage = localStorage.getItem(storageKey);
  
//   if (!oidcStorage) {
//     return null;
//   }
  
//   try {
//     const user = User.fromStorageString(oidcStorage);
    
//     if (!user || !user.access_token) {
//       return null;
//     }
    
//     if (user.expired) {
//       console.warn('Access token has expired');
//       return null;
//     }
    
//     return user;
//   } catch (error) {
//     console.error('Error parsing user from storage:', error);
//     return null;
//   }
// }

// export const secureApiCognito = axios.create({
//   baseURL: `${BACKEND_URL}/api`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// secureApiCognito.interceptors.request.use(
//   (config) => {
//     const user = getUser();
//     if (user?.access_token) {
//       config.headers.Authorization = `Bearer ${user.access_token}`;
//     }
    
//     if (config.data) {
//       const { encryptedData, encryptedAesKey } = encryptRequest(config.data);
//       config.data = { encryptedData };
//       config.headers['x-encrypted-key'] = encryptedAesKey;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// secureApiCognito.interceptors.response.use(
//   (response) => {
//     // console.log("secureApiCognito interceptors response")
//     // console.log("response.headers['x-encrypted-key'] outside: ", response.headers['x-encrypted-key'])
//     // console.log("response.data.encryptedData outside: ", response.data?.encryptedData);
//     if (response.data?.encryptedData && response.headers['x-encrypted-key']) {
//       const encryptedData = response.data.encryptedData;
//       // console.log("response.data.encryptedData: ", encryptedData);
//       const encryptedAesKey = response.headers['x-encrypted-key'];
//       // console.log("response.headers['x-encrypted-key': ", encryptedAesKey);

//       response.data = decryptResponse(encryptedData, encryptedAesKey);
//       // console.log("response.data decrypted: ", response.data);
//     }
    
//     return response;
//   },
//   (error) => Promise.reject(error)
// );