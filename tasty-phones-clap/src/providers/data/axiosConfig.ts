// src/providers/data/axiosConfig.ts
import axios from "axios";

// Dùng VITE environment (nếu có .env.local thì tự động lấy, không thì fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // BẬT ĐỂ SANCTUM GỬI COOKIE (laravel_session + XSRF-TOKEN)
  headers: {
    Accept: "application/json",
    // KHÔNG ĐẶT Content-Type ở đây → để browser tự set khi có FormData
  },
});

// INTERCEPTOR QUAN TRỌNG NHẤT – GIẢI QUYẾT 100% VẤN ĐỀ CỦA ANH
axiosInstance.interceptors.request.use((config) => {
  // 1. Ưu tiên dùng Bearer Token nếu có trong localStorage (từ login thủ công hoặc Clerk)
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Nếu request là upload file (FormData) → xóa Content-Type để browser tự set boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  // 3. Đảm bảo luôn gửi cookie Sanctum (rất quan trọng khi F5 trang)
  config.withCredentials = true;

  return config;
});

// Thêm response interceptor để bắt lỗi 401 → tự động logout nếu token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;