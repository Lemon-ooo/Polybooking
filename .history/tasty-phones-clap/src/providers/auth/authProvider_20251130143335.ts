// authProvider-simple.ts
import { message } from "antd";

const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const authProvider = {
  // ======================
  // 🔐 LOGIN
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

      if (!response.ok) {
        throw new Error(res.message || "Email hoặc mật khẩu không đúng!");
      }

      const apiData = res.data;
      const token = `Bearer ${apiData.token}`;
      const user = apiData.user;

      localStorage.removeItem("auth");

      const authState = {
        ...user,
        token,
      };

      localStorage.setItem("auth", JSON.stringify(authState));

      const role = user.role;
      let redirectTo = "/";
      if (role === "admin") redirectTo = "/admin/dashboard";
      if (role === "customer") redirectTo = "/client";

      message.success("Đăng nhập thành công!");
      return { success: true, redirectTo };
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại!");
      throw error;
    }
  },

  // ======================
  // 🔓 LOGOUT
  // ======================
  logout: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (auth) {
        const { token } = JSON.parse(auth);
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        });
      }
    } catch (_) {}

    localStorage.removeItem("auth");
    message.success("Đăng xuất thành công!");
    return { success: true, redirectTo: "/login" };
  },

  // ======================
  // 🧩 CHECK - SIMPLE
  // ======================
  check: async () => {
    const auth = localStorage.getItem("auth");
    console.log("🔐 SIMPLE CHECK - Auth exists:", !!auth);
    return { authenticated: !!auth };
  },

  // ======================
  // 👤 GET IDENTITY
  // ======================
  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;

    try {
      return JSON.parse(auth);
    } catch {
      return null;
    }
  },

  // ======================
  // 🔄 FORGOT PASSWORD
  // ======================
  forgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể reset mật khẩu!");
      }

      message.success("Mật khẩu mới đã được gửi qua email!");
      return { success: true, redirectTo: "/login" };
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra!");
      throw error;
    }
  },

  // ======================
  // ⚠️ ON ERROR
  // ======================
  onError: async (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem("auth");
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
