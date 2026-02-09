import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_APP_API_URL,
  withCredentials: true,
});

let accessToken = null;

export const setAuthToken = (token) => {
  accessToken = token || null;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default apiClient;
