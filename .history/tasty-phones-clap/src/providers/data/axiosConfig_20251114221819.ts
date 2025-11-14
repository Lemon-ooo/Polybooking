// src/providers/data/axiosConfig.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8001/api", // 👈 sửa nếu backend khác port
  withCredentials: true, // cần nếu bạn dùng Laravel Sanctum
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // QUAN TRỌNG: Nếu là FormData → XÓA Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default axiosInstance;
