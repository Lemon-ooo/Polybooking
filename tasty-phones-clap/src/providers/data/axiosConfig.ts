// src/providers/data/axiosConfig.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  // XÓA HOÀN TOÀN headers: { "Content-Type": ... }
  // → ĐỂ TRÌNH DUYỆT TỰ SET multipart/form-data
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