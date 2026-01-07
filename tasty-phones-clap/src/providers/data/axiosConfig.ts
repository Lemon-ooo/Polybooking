import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// 🔥 FLAG để chỉ gọi csrf-cookie 1 lần
let csrfLoaded = false;

axiosInstance.interceptors.request.use(async (config) => {
  // 1️⃣ Load CSRF cookie cho Sanctum (CHỈ 1 LẦN)
  if (!csrfLoaded) {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
    csrfLoaded = true;
  }

  // 2️⃣ Gắn Bearer token nếu có
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 3️⃣ Upload file → để browser tự set Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  config.withCredentials = true;

  return config;
});

// 4️⃣ Auto logout nếu 401
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
