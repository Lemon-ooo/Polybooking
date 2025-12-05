// authProvider-simple.ts
import { message } from "antd";
import { IRegisterForm } from "../../interfaces/auth";

const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const authProvider = {
  // ======================
  // LOGIN
  // ======================
  login: async ({ email, password }: any) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();
      console.log("Response từ /api/login:", res); // Debug để bạn thấy cấu trúc

      if (!response.ok) {
        throw new Error(res.message || "Email hoặc mật khẩu không đúng!");
      }

      // Cấu trúc response hiện tại của bạn:
      // { success: true, data: { user: {...}, token: "1|xxx", token_type: "Bearer" } }
      const apiData = res.data;
      const token = apiData.token;           // ← lấy token đúng chỗ
      const user = apiData.user;             // ← lấy user đúng chỗ

      if (!token || !user) {
        throw new Error("Không nhận được token hoặc thông tin user từ server!");
      }

      // Lưu vào localStorage theo đúng format mà axiosInstance đang dùng
      localStorage.setItem("token", token); // ← axiosInstance đọc cái này để gắn Bearer

      const authState = {
        ...user,
        role: user.role || "customer",
        token: `Bearer ${token}`, // giữ lại cả Bearer nếu cần
      };
      localStorage.setItem("auth", JSON.stringify(authState));

      message.success("Đăng nhập thành công!");

      // Redirect theo role
      let redirectTo = "/client";
      if (user.role === "admin") redirectTo = "/admin/dashboard";

      return { success: true, redirectTo };
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại!");
      throw error;
    }
  },

  // ======================
  // LOGOUT
  // ======================
  logout: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (auth) {
        const parsed = JSON.parse(auth);
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: parsed.token || "",
            Accept: "application/json",
          },
        });
      }
    } catch (_) {
      // Ignore lỗi logout
    }

    localStorage.removeItem("auth");
    localStorage.removeItem("token"); // ← xóa luôn token
    message.success("Đăng xuất thành công!");
    return { success: true, redirectTo: "/login" };
  },

  // ======================
  // CHECK
  // ======================
  check: async () => {
    const token = localStorage.getItem("token");
    const authenticated = !!token;
    console.log("CHECK AUTH:", authenticated ? "Yes" : "No");
    return { authenticated };
  },

  // ======================
  // GET IDENTITY
  // ======================
  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return {
        ...parsed,
        name: parsed.user_name || parsed.email,
      };
    } catch {
      return null;
    }
  },

  // ======================
  // REGISTER (giữ nguyên, chỉ tinh chỉnh nhỏ)
  // ======================
  register: async ({
    user_name,
    email,
    password,
    password_confirmation,
  }: IRegisterForm) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_name,
          email,
          password,
          password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Đăng ký thất bại!";
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          errorMessage = firstError?.[0] || errorMessage;
        } else if (data.message) {
          errorMessage = data.message;
        }
        throw new Error(errorMessage);
      }

      const apiData = data.data;
      const token = apiData.token;
      const user = apiData.user;

      if (!token) throw new Error("Không nhận được token sau khi đăng ký!");

      localStorage.setItem("token", token);
      localStorage.setItem("auth", JSON.stringify({ ...user, token: `Bearer ${token}` }));

      message.success("Đăng ký thành công!");
      return {
        success: true,
        redirectTo: user.role === "admin" ? "/admin/dashboard" : "/client",
      };
    } catch (error: any) {
      message.error(error.message);
      throw error;
    }
  },

  // ======================
  // FORGOT PASSWORD
  // ======================
  forgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể gửi mật khẩu mới!");
      }

      message.success("Mật khẩu mới đã được gửi đến email của bạn!");
      return { success: true, redirectTo: "/login" };
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra!");
      throw error;
    }
  },

  // ======================
  // ON ERROR (401 → tự động logout)
  // ======================
  onError: async (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      return { logout: true, redirectTo: "/login", error };
    }
    return { error };
  },
};