import { AuthProvider } from "@refinedev/core";
import { LoginRequest, LoginResponse, User } from "../../interfaces";

const API_URL = "http://localhost:8000/api";

export const authProvider: AuthProvider = {
  // 🔐 LOGIN
  login: async ({ email, password }: LoginRequest) => {
    try {
      console.log("🔐 Attempting login for:", email);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      console.log("✅ Login response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const redirectTo =
          data.redirect_to ||
          (data.user.role === "admin" ? "/admin" : "/client");

        console.log("🔄 Redirecting to:", redirectTo);
        return { success: true, redirectTo };
      }

      return {
        success: false,
        error: {
          message: data.message || "Đăng nhập thất bại",
          name: "LoginError",
        },
      };
    } catch (error: any) {
      console.error("❌ Login catch error:", error);
      return {
        success: false,
        error: {
          message: error.message || "Lỗi kết nối máy chủ",
          name: "NetworkError",
        },
      };
    }
  },

  // 🚪 LOGOUT
  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return { success: true, redirectTo: "/login" };
    } catch (error) {
      console.error("❌ Logout error:", error);
      return {
        success: false,
        error: { message: "Đăng xuất thất bại", name: "LogoutError" },
      };
    }
  },

  // 🔍 CHECK AUTH
  check: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { authenticated: false, redirectTo: "/login", logout: true };
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        return { authenticated: true };
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { authenticated: false, redirectTo: "/login", logout: true };
    } catch (error) {
      console.error("❌ Check error:", error);
      return { authenticated: true }; // ⚠️ Dev mode: cho phép tiếp tục
    }
  },

  // ⚠️ HANDLE ERROR
  onError: async (error) => {
    console.error("🚨 Auth onError:", error);
    if (error?.status === 401 || error?.status === 403) {
      localStorage.clear();
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },

  // 👤 GET IDENTITY
  getIdentity: async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        return {
          id: user.id,
          name: user.name,
          avatar: undefined,
          role: user.role,
        };
      }
      return null;
    } catch (error) {
      console.error("❌ GetIdentity error:", error);
      return null;
    }
  },

  // 🔑 GET PERMISSIONS
  getPermissions: async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        return user.role;
      }
      return null;
    } catch (error) {
      console.error("❌ GetPermissions error:", error);
      return null;
    }
  },

  // 📝 REGISTER (giống login)
  register: async ({ name, email, password, password_confirmation }) => {
    try {
      console.log("📝 Attempting registration for:", email);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Register error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Register response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const redirectTo =
          data.redirect_to ||
          (data.user.role === "admin" ? "/admin" : "/client");

        console.log("🎉 Registration successful, redirect to:", redirectTo);
        return { success: true, redirectTo };
      }

      return {
        success: false,
        error: {
          message: data.message || "Đăng ký thất bại",
          name: "RegisterError",
        },
      };
    } catch (error: any) {
      console.error("❌ Register catch error:", error);
      return {
        success: false,
        error: {
          message: error.message || "Lỗi kết nối máy chủ",
          name: "NetworkError",
        },
      };
    }
  },

  forgotPassword: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
};
