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

      if (!response.ok) {
        throw new Error(res.message || "Email hoặc mật khẩu không đúng!");
      }

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Thiếu user hoặc token từ server!");
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...user,
          role: user.role || "customer",
          token: `Bearer ${token}`,
        })
      );

      message.success("Đăng nhập thành công!");

      return { success: true };
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
    } catch (_) {}

    localStorage.removeItem("auth");
    localStorage.removeItem("token");

    message.success("Đăng xuất thành công!");
    return { success: true, redirectTo: "/login" };
  },

  // ======================
  // CHECK
  // ======================
  check: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
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
  // REGISTER
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
        throw new Error(data.message || "Đăng ký thất bại!");
      }

      const { user, token } = data.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...user, token: `Bearer ${token}` })
      );

      message.success("Đăng ký thành công!");
      return { success: true };
    } catch (error: any) {
      message.error(error.message);
      throw error;
    }
  },

  // ======================
  // FORGOT PASSWORD (NEW)
  // ======================
  forgotPassword: async ({ email }: any) => {
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
        throw new Error(data.message || "Không gửi được email reset mật khẩu!");
      }

      message.success("Email reset mật khẩu đã được gửi!");
      return { success: true };
    } catch (error: any) {
      message.error(error.message || "Lỗi gửi email reset mật khẩu!");
      return { success: false };
    }
  },

  // ======================
  // ON ERROR
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
