import axios from "axios";

// Địa chỉ API backend Laravel của bạn
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // 👈 sửa nếu backend khác port
  withCredentials: true, // cần nếu bạn dùng Laravel Sanctum
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Middleware: tự động gắn token vào header Authorization
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
