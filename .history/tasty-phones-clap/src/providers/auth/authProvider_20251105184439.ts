import { AuthProvider } from "@refinedev/core";
import { LoginRequest, LoginResponse, User } from "../../interfaces";

const API_URL = "http://localhost:8000/api";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: LoginRequest) => {
    try {
      console.log("🔐 Attempting login for:", email); // ✅ Debug

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      console.log("✅ Login response:", data); // ✅ Debug

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Ưu tiên dùng redirect_to từ server, fallback về logic client
        const redirectTo =
          data.redirect_to ||
          (data.user.role === "admin" ? "/admin" : "/client");

        console.log("🔄 Redirecting to:", redirectTo); // ✅ Debug

        return {
          success: true,
          redirectTo: redirectTo,
        };
      } else {
        return {
          success: false,
          error: {
            message: data.message || "Đăng nhập thất bại",
            name: "LoginError",
          },
        };
      }
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

  logout: async () => {
    const token = localStorage.getItem("token");
    console.log("🚪 Logging out..."); // ✅ Debug

    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ Logout API call successful");
      } catch (error) {
        console.error("❌ Logout API error:", error);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async (ctx) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log(
      "🔍 Auth check - Token exists:",
      !!token,
      "User exists:",
      !!user
    ); // ✅ Debug

    if (!token) {
      console.log("❌ No token, redirect to login");
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📊 Profile check status:", response.status); // ✅ Debug

      if (response.ok) {
        console.log("✅ User is authenticated");
        return {
          authenticated: true,
        };
      } else {
        console.log("❌ Token invalid, clearing storage");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
        };
      }
    } catch (error) {
      console.error("❌ Check error, assuming authenticated:", error);
      // Trong môi trường production, có thể return false
      // Nhưng trong development, return true để tiếp tục debug
      return {
        authenticated: true,
      };
    }
  },

  onError: async (error) => {
    console.error("🚨 Auth onError:", error);

    if (error?.status === 401 || error?.status === 403) {
      console.log("🛑 Unauthorized/Forbidden, logging out");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return {};
  },

  getIdentity: async () => {
    try {
      const userStr = localStorage.getItem("user");
      console.log("👤 GetIdentity - user from storage:", userStr); // ✅ Debug

      if (userStr) {
        const user: User = JSON.parse(userStr);
        console.log("👤 GetIdentity - parsed user:", user);
        return {
          id: user.id,
          name: user.name,
          avatar: undefined,
          role: user.role,
        };
      }
      console.log("👤 GetIdentity - no user found");
      return null;
    } catch (error) {
      console.error("❌ GetIdentity error:", error);
      return null;
    }
  },

  getPermissions: async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        console.log("🔑 GetPermissions - user role:", user.role); // ✅ Debug
        return user.role;
      }
      return null;
    } catch (error) {
      console.error("❌ GetPermissions error:", error);
      return null;
    }
  },

  // ✅ Refine v5 required methods
  register: async (params) => {
    console.log("📝 Register called (not implemented)");
    return { success: false };
  },

  forgotPassword: async (params) => {
    console.log("🔑 ForgotPassword called (not implemented)");
    return { success: false };
  },

  updatePassword: async (params) => {
    console.log("🔄 UpdatePassword called (not implemented)");
    return { success: false };
  },
};
