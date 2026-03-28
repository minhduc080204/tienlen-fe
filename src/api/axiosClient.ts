// src/api/axiosClient.ts
import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api" || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      useAuthStore.getState().logout();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;